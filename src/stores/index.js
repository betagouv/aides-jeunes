import { defineStore } from "pinia"
import dayjs from "dayjs"
import { version } from "../../lib/simulation"
import { computeAides, datesGenerator } from "../../lib/benefits/compute"
import { generateAllSteps } from "../../lib/state/generator"
import { isStepAnswered, storeAnswer } from "../../lib/answers"
import { categoriesRnc, patrimoineTypes } from "../../lib/resources"
import some from "lodash/some"
import values from "lodash/values"
import axios from "axios"
import { generateSituation } from "../../lib/situations"
import ABTestingService from "@/plugins/ab-testing-service"
import Institution from "@/lib/institution"

function defaultCalculs() {
  return {
    resultats: {
      droitsEligibles: null,
      droitsNonEligibles: null,
      droitsInjectes: null,
    },
    dirty: false,
    error: false,
    exception: false,
    updating: false,
  }
}

function defaultStore() {
  const now = dayjs().format()

  return {
    situationId: null,
    simulation: {
      answers: {
        all: [],
        current: [],
      },
      dateDeValeur: new Date(),
      version,
    },
    message: {
      text: null,
      counter: null,
    },
    debug: false,
    error: false,
    access: {
      fetching: false,
      forbidden: false,
    },
    calculs: defaultCalculs(),
    dates: datesGenerator(now),
    ameliNoticationDone: false,
    lieux: null,
    title: null,
    themeColor: null,
    inIframe: false,
    iframeOrigin: null,
    saveSituationError: null,
    openFiscaParameters: {},
    recapEmailState: undefined,
  }
}

// function restoreLocal() {
//   let store
//   if (window.sessionStorage.store) {
//     store = JSON.parse(window.sessionStorage.store)
//   }
//
//   if (!store || !store.simulation || !store.simulation.dateDeValeur) {
//     store = defaultStore()
//   }
//
//   return {
//     situationId: store.situationId,
//     simulation: store.simulation,
//     calculs: store.calculs || defaultCalculs(),
//     dates: datesGenerator(store.simulation.dateDeValeur),
//     ameliNoticationDone: store.ameliNoticationDone,
//     recapEmailState: store.recapEmailState,
//   }
// }

export const useStore = defineStore("store", {
  state: () => defaultStore(),
  getters: {
    passSanityCheck() {
      return this.situation.demandeur && this.situation.demandeur.date_naissance
    },
    getDebug() {
      return this.debug
    },
    peopleParentsFirst() {
      return []
        .concat(
          this.situation.demandeur,
          this.situation.conjoint,
          this.situation.enfants
        )
        .filter((individu) => individu)
    },
    getIndividu() {
      return (id) => {
        const items = this.peopleParentsFirst.filter((i) => i.id === id)
        return items.length ? items[0] : null
      }
    },
    getAllSteps() {
      return generateAllSteps(this.situation, this.openFiscaParameters)
    },
    getAllAnsweredSteps() {
      const allSteps = this.getAllSteps.filter(
        (step) =>
          step.path !== "/" &&
          step.path !== "/simulation/resultats" &&
          step.isActive
      )
      return allSteps.filter((step) =>
        isStepAnswered(this.simulation.answers.all, step)
      )
    },
    lastUnansweredStep() {
      const allSteps = this.getAllSteps.filter(
        (step) =>
          step.path !== "/" &&
          step.path !== "/simulation/resultats" &&
          step.isActive
      )
      return allSteps.find(
        (step) => !isStepAnswered(this.simulation.answers.all, step)
      )
    },
    ressourcesYearMinusTwoCaptured() {
      const yearMinusTwo = this.dates.fiscalYear.id
      const januaryYearMinusTwo = this.dates.fiscalYear12Months[0].id
      return this.peopleParentsFirst.some((individu) => {
        return categoriesRnc.reduce((hasYm2RessourcesAccum, categorieRnc) => {
          if (!individu[categorieRnc.id]) {
            return hasYm2RessourcesAccum
          }

          return (
            hasYm2RessourcesAccum ||
            typeof individu[categorieRnc.id][yearMinusTwo] == "number" ||
            typeof individu[categorieRnc.id][januaryYearMinusTwo] == "number"
          )
        }, false)
      })
    },
    isProprietaireAvecPretEnCours() {
      const menage = this.situation.menage
      const isProprietaire = ["primo_accedant", "proprietaire"].includes(
        menage.statut_occupation_logement
      )
      return isProprietaire && menage.loyer > 0
    },
    isHebergeParticipeFrais() {
      const menage = this.situation.menage
      return (
        menage.statut_occupation_logement === "loge_gratuitement" &&
        menage.participation_frais
      )
    },
    /* This function returns
     * - undefined if demandeur do not have any patrimoine ressource
     * - false if those ressources are all null else
     * - true
     */
    hasPatrimoine() {
      const demandeur = this.situation.demandeur
      if (!demandeur) {
        return undefined
      }

      return patrimoineTypes.reduce((accum, ressource) => {
        if (!demandeur[ressource.id]) {
          return accum
        }

        return accum || some(values(demandeur[ressource.id]))
      }, undefined)
    },
    fetchRepresentation() {
      return (representation, situationId) => {
        return axios
          .get(
            `api/simulation/${
              situationId || this.situationId
            }/${representation}`
          )
          .then((response) => response.data)
      }
    },
    hasResults() {
      return (
        this.situationId &&
        this.calculs.resultats._id &&
        this.calculs.resultats._id === this.situationId
      )
    },
    situation() {
      return generateSituation(this.simulation, true)
    },
  },
  actions: {
    setDirty() {
      this.calculs.dirty = true
    },
    answer(answer) {
      this.simulation.answers = {
        ...this.simulation.answers,
        all: storeAnswer(this.simulation.answers.all, answer, false),
        current: storeAnswer(
          this.simulation.answers.current,
          answer,
          true,
          this.simulation.enfants
        ),
      }
      this.setDirty()
    },
    updateCurrentAnswers(newPath) {
      const steps = this.getAllSteps
      const currentAnswers = []
      let i = 0
      let currentStep = steps[0]
      while (currentStep && currentStep.path !== newPath) {
        if (currentStep.isActive && currentStep.path !== "/") {
          const currentAnswer = this.simulation.answers.all.find((answer) => {
            return (
              answer.id === currentStep.id &&
              answer.entityName === currentStep.entity &&
              answer.fieldName === currentStep.variable
            )
          })

          if (currentAnswer) {
            currentAnswers.push(currentAnswer)
          }
        }
        i = i + 1
        currentStep = steps[i]
      }
      this.simulation.answers.current = currentAnswers
    },
    ressourcesFiscales(ressourcesFiscales) {
      this.simulation = {
        ...this.simulation,
        ressourcesFiscales,
      }
      this.setDirty()
    },
    patrimoine(patrimoine) {
      this.simulation = {
        ...this.simulation,
        patrimoine,
      }
      this.setDirty()
    },
    initialize() {
      // Object.assign(this, restoreLocal(), { saveSituationError: null })
    },
    resetSimulation() {
      const store = defaultStore()

      const newStore = {
        situationId: store.situationId,
        simulation: store.simulation,
        calculs: store.calculs,
        dates: datesGenerator(store.simulation.dateDeValeur),
        ameliNoticationDone: store.ameliNoticationDone,
        recapEmailState: store.recapEmailState,
        saveSituationError: null,
      }
      Object.assign(this, newStore)
    },
    clear(external_id) {
      this.access.forbidden = false
      this.access.fetching = false

      this.resetSimulation()

      this.external_id = external_id
    },
    setDebug(debug) {
      this.debug = debug
    },
    addEnfant() {
      let enfantId
      let enfants
      if (this.simulation.enfants && this.simulation.enfants.length > 0) {
        enfantId =
          this.simulation.enfants[this.simulation.enfants.length - 1] + 1
        enfants = [...this.simulation.enfants, enfantId]
      } else {
        enfantId = 0
        enfants = [enfantId]
      }
      const answer = {
        entityName: "individu",
        id: `enfant_${enfantId}`,
        fieldName: "_firstName",
        value: `votre ${enfants.length}${
          enfants.length === 1 ? "ᵉʳ" : "ᵉ"
        } enfant`,
      }

      // When you add a children you need to remove all current answer after the child validation
      const currentLastIndex = this.simulation.answers.current.findIndex(
        (answer) => answer.entityName === "enfants"
      )

      const currentAnswers =
        currentLastIndex === -1
          ? this.simulation.answers.current
          : this.simulation.answers.current.splice(0, currentLastIndex)

      this.simulation = {
        ...this.simulation,
        enfants,
        answers: {
          all: storeAnswer(this.simulation.answers.all, answer, false),
          current: storeAnswer(
            currentAnswers,
            answer,
            true,
            this.simulation.enfants
          ),
        },
      }
      this.setDirty()
    },
    editEnfant(id) {
      // When you edit a children you need to remove all current answer after the child validation
      const currentLastIndex = this.simulation.answers.current.findIndex(
        (answer) => answer.entityName === "enfants"
      )

      const currentAnswers =
        currentLastIndex === -1
          ? this.simulation.answers.current
          : this.simulation.answers.current.splice(0, currentLastIndex)

      this.simulation.answers = {
        ...this.simulation.answers,
        current: currentAnswers.filter(
          (answer) => answer.id !== `enfant_${id}`
        ),
      }

      this.setDirty()
    },
    removeEnfant(id) {
      const enfantIndex = id.split("_")[1]
      this.simulation = {
        ...this.simulation,
        enfants: this.simulation.enfants.filter((i) => i !== enfantIndex),
      }
      this.setDirty()
    },
    updateError(error) {
      this.error = error
    },
    setRecapEmailState(newState) {
      this.recapEmailState = newState
    },
    setId(id) {
      this.situationId = id
      this.calculs.dirty = false
    },
    save() {
      this.setRecapEmailState(undefined)

      let simulation = { ...this.simulation, _id: undefined }
      if (this.situationId) {
        simulation.modifiedFrom = this.situationId
      }

      simulation.abtesting = ABTestingService.getEnvironment()
      return axios
        .post("/api/simulation", simulation)
        .then((result) => result.data)
        .then((payload) => payload._id)
        .then((id) => this.setId(id))
    },
    reset(simulation) {
      this.access.fetching = false
      this.simulation = simulation
      this.dates = datesGenerator(simulation.dateDeValeur || new Date())
      this.ameliNoticationDone = false
      this.calculs.dirty = false
    },
    saveAccessFailure() {
      this.access.fetching = false
      this.access.forbidden = true
    },
    fetch(id) {
      this.setRecapEmailState(undefined)

      this.access.fetching = true

      return axios
        .get(`/api/simulation/${id}`)
        .then((result) => result.data)
        .then((payload) => this.reset(payload))
        .then(() => this.setId(id))
        .catch((e) => {
          console.log(e)
          this.saveAccessFailure()
        })
    },
    setResults(results) {
      this.calculs.resultats = results
      this.calculs.updating = false
    },
    mockResults(benefit) {
      this.setResults(Institution.mockResults(benefit))
    },
    startComputation() {
      this.calculs.updating = true
      this.calculs.exception = false
      this.calculs.error = false
    },
    saveComputationFailure(error) {
      this.calculs.updating = false
      this.calculs.error = true
      this.calculs.exception = (error.response && error.response.data) || error
    },
    compute(showPrivate) {
      this.startComputation()

      return axios
        .get(`api/simulation/${this.situationId}/openfisca-response`)
        .then((openfiscaResponse) => {
          return openfiscaResponse.data
        })
        .then((openfiscaResponse) => {
          return computeAides.bind(Institution.benefits)(
            this.situation,
            this.situationId,
            openfiscaResponse,
            showPrivate
          )
        })
        .then((results) => this.setResults(results))
        .catch((error) => {
          this.saveComputationFailure(error)
        })
    },
    setMessage(message, counter) {
      this.message = {
        text: message,
        counter: counter || 1,
      }
    },
    decrementMessageRemainingViewTime() {
      if (!this.message.text) {
        return
      }

      this.message.counter = this.message.counter - 1
      if (this.message.counter < 0) {
        this.message.text = null
      }
    },
    redirection(next) {
      this.setMessage(
        `Vous avez été redirigé·e sur la première page du simulateur. Vous pensez que c'est une erreur&nbsp;? Contactez-nous&nbsp: <a href="mailto:${process.env.VUE_APP_CONTACT_EMAIL}">${process.env.VUE_APP_CONTACT_EMAIL}</a>.`
      )
      next("/simulation")
    },
    setOpenFiscaParameters() {
      const date = new Date(this.simulation.dateDeValeur)
      return axios
        .get(`api/openfisca/parameters/${date.toISOString()}`)
        .then((response) => {
          this.openFiscaParameters = response.data
        })
    },
    verifyBenefitVariables() {
      return axios
        .get("api/openfisca/missingbenefits")
        .then((response) => response.data)
        .then((missingBenefits) => {
          if (missingBenefits.length) {
            this.setMessage(
              `🚀 Vous avez ajouté <abbr title="${missingBenefits.join(
                ", "
              )}">une nouvelle aide</abbr>&nbsp;!<br/>Étant donné que nous ne savons pas encore comm


ent celle-ci doit être calculée, si vous faites votre simulation jusqu’au bout vous obtiendrez un message d’erreur.`
            )
          }
        })
    },
    setSaveSituationError(saveSituationError) {
      this.saveSituationError = saveSituationError
    },
    setAmeliNoticationDone() {
      this.ameliNoticationDone = true
    },
    setIframeOrigin(newOrigin) {
      this.inIframe = true
      this.iframeOrigin = newOrigin
    },
    setThemeColor(themeColor) {
      this.themeColor = themeColor
    },
    setTitle(newTitle) {
      this.title = newTitle
    },
  },
})
