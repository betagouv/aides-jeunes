import { defineStore } from "pinia"
import dayjs from "dayjs"
import { version } from "@lib/simulation.js"
import { computeAides, datesGenerator } from "@lib/benefits/compute.js"
import { generateAllSteps } from "@lib/state/generator.js"
import { isStepAnswered, storeAnswer } from "@lib/answers.js"
import { categoriesRnc, patrimoineTypes } from "@lib/resources.js"
import { some, values } from "lodash-es"
import axios from "axios"
import { generateSituation } from "@lib/situations.js"
import ABTestingService from "@/plugins/ab-testing-service.js"
import Institution from "@/lib/institution.js"
import {
  Answer,
  Calculs,
  PersistedStore,
  Resultats,
  Simulation,
  Situation,
  Store,
} from "@lib/types/store"

function defaultCalculs(): Calculs {
  return {
    dirty: false,
    error: false,
    exception: false,
    resultats: {
      _id: undefined,
      droitsEligibles: null,
      droitsInjectes: null,
      droitsNonEligibles: null,
    },
    updating: false,
  }
}

function defaultStore(): Store {
  const now = dayjs().format()

  return {
    access: {
      fetching: false,
      forbidden: false,
    },
    ameliNoticationDone: false,
    calculs: defaultCalculs(),
    dates: datesGenerator(now),
    debug: false,
    error: false,
    external_id: undefined,
    iframeOrigin: null,
    inIframe: false,
    message: {
      counter: null,
      text: null,
    },
    openFiscaParameters: {},
    recapEmailState: undefined,
    saveSituationError: null,
    simulation: {
      answers: {
        all: [],
        current: [],
      },
      dateDeValeur: new Date(),
      version,
    },
    situationId: null,
    themeColor: null,
    title: null,
  }
}

function getPersitedStateProperties(
  state: Store,
  save = false
): PersistedStore {
  const persistedStoreData: PersistedStore = {
    ameliNoticationDone: state.ameliNoticationDone,
    calculs: state.calculs || defaultCalculs(),
    recapEmailState: state.recapEmailState,
    simulation: state.simulation,
    situationId: state.situationId,
  }
  if (!save) {
    persistedStoreData.dates = datesGenerator(state.simulation.dateDeValeur)
  }

  return persistedStoreData
}

function restoreLocal() {
  let state
  if (window.sessionStorage.store) {
    state = JSON.parse(window.sessionStorage.store)
  }

  if (!state || !state.simulation || !state.simulation.dateDeValeur) {
    state = defaultStore()
  }

  return getPersitedStateProperties(state)
}

export function persistDataOnSessionStorage({
  after,
  store,
  name,
}: {
  after: (callback: () => void) => void
  store: Store
  name: string
}) {
  after(() => {
    if (name === "initialize") {
      return
    }
    const persitedStateProperties = getPersitedStateProperties(store, true)
    window.sessionStorage.setItem(
      "store",
      JSON.stringify(persitedStateProperties)
    )
  })
}

export const useStore = defineStore("store", {
  actions: {
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
        fieldName: "_firstName",
        id: `enfant_${enfantId}`,
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
        answers: {
          all: storeAnswer(this.simulation.answers.all, answer, false),
          current: storeAnswer(
            currentAnswers,
            answer,
            true,
            this.simulation.enfants
          ),
        },
        enfants,
      }
      this.setDirty()
    },
    answer(answer: Answer) {
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
    clear(external_id: string) {
      this.access.forbidden = false
      this.access.fetching = false

      this.resetSimulation()

      this.external_id = external_id
    },
    compute(showPrivate: boolean) {
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
        .then((results) => this.setResults(results as Resultats))
        .catch((error) => {
          this.saveComputationFailure(error)
        })
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
    editEnfant(id: number) {
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
    fetch(id: string) {
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
    initialize() {
      Object.assign(this, restoreLocal(), { saveSituationError: null })
    },
    mockResults(benefit: any) {
      // @ts-ignore
      this.setResults(Institution.mockResults(benefit))
    },
    patrimoine(patrimoine: any) {
      this.simulation = {
        ...this.simulation,
        patrimoine,
      }
      this.setDirty()
    },
    redirection(next: (path: string) => void) {
      this.setMessage(
        `Vous avez été redirigé·e sur la première page du simulateur. Vous pensez que c'est une erreur&nbsp;? Contactez-nous&nbsp: <a href="mailto:${process.env.VUE_APP_CONTACT_EMAIL}">${process.env.VUE_APP_CONTACT_EMAIL}</a>.`
      )
      next("/simulation")
    },
    removeEnfant(id: string) {
      const enfantIndex = parseInt(id.split("_")[1])
      this.simulation = {
        ...this.simulation,
        enfants: this.simulation.enfants?.filter((i) => i !== enfantIndex),
      }
      this.setDirty()
    },
    reset(simulation: Simulation) {
      this.access.fetching = false
      this.simulation = simulation
      this.dates = datesGenerator(simulation.dateDeValeur || new Date())
      this.ameliNoticationDone = false
      this.calculs.dirty = false
    },
    resetSimulation() {
      const state = defaultStore()

      const newStore = getPersitedStateProperties(state)
      Object.assign(this, newStore)
    },
    ressourcesFiscales(ressourcesFiscales: any) {
      this.simulation = {
        ...this.simulation,
        ressourcesFiscales,
      }
      this.setDirty()
    },
    save() {
      this.setRecapEmailState(undefined)

      const simulation = { ...this.simulation, _id: undefined }
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
    saveAccessFailure() {
      this.access.fetching = false
      this.access.forbidden = true
    },
    saveComputationFailure(error: any) {
      this.calculs.updating = false
      this.calculs.error = true
      this.calculs.exception = (error.response && error.response.data) || error
    },
    setAmeliNoticationDone() {
      this.ameliNoticationDone = true
    },
    setDebug(debug: boolean) {
      this.debug = debug
    },
    setDirty() {
      this.calculs.dirty = true
    },
    setId(id: string) {
      this.situationId = id
      this.calculs.dirty = false
    },
    setIframeOrigin(newOrigin: string) {
      this.inIframe = true
      this.iframeOrigin = newOrigin
    },
    setMessage(message: string, counter?: number) {
      this.message = {
        counter: counter || 1,
        text: message,
      }
    },
    setOpenFiscaParameters() {
      // @ts-ignore
      const date = new Date(this.simulation.dateDeValeur)
      return axios
        .get(`api/openfisca/parameters/${date.toISOString()}`)
        .then((response) => {
          this.openFiscaParameters = response.data
        })
    },
    setRecapEmailState(newState: string | undefined) {
      this.recapEmailState = newState
    },
    setResults(results: Resultats) {
      this.calculs.resultats = results
      this.calculs.updating = false
    },
    setSaveSituationError(saveSituationError: string) {
      this.saveSituationError = saveSituationError
    },
    setThemeColor(themeColor: string) {
      this.themeColor = themeColor
    },
    setTitle(newTitle: string) {
      this.title = newTitle
    },
    startComputation() {
      this.calculs.updating = true
      this.calculs.exception = false
      this.calculs.error = false
    },
    updateCurrentAnswers(newPath: string) {
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
    updateError(error: string) {
      this.error = error
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
  },
  getters: {
    fetchRepresentation() {
      return (representation: string, situationId: string) => {
        return axios
          .get(
            `api/simulation/${
              situationId || this.situationId
            }/${representation}`
          )
          .then((response) => response.data)
      }
    },
    getAllAnsweredSteps(): any[] {
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
    getAllSteps(): any[] {
      return generateAllSteps(this.situation, this.openFiscaParameters)
    },

    getDebug(): boolean {
      return this.debug
    },

    /* This function returns
     * - undefined if demandeur do not have any patrimoine ressource
     * - false if those ressources are all null else
     * - true
     */
    hasPatrimoine(): any {
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

    hasResults(): boolean {
      return Boolean(
        this.situationId &&
          this.calculs.resultats._id &&
          this.calculs.resultats._id === this.situationId
      )
    },

    isHebergeParticipeFrais(): boolean {
      const menage = this.situation.menage
      return (
        menage.statut_occupation_logement === "loge_gratuitement" &&
        menage.participation_frais
      )
    },

    isProprietaireAvecPretEnCours(): boolean {
      const menage = this.situation.menage
      const isProprietaire = ["primo_accedant", "proprietaire"].includes(
        menage.statut_occupation_logement
      )
      return isProprietaire && menage.loyer > 0
    },

    lastUnansweredStep(): any {
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

    passSanityCheck(): boolean {
      return Boolean(
        this.situation.demandeur && this.situation.demandeur.date_naissance
      )
    },
    peopleParentsFirst(): any[] {
      return []
        .concat(
          // @ts-ignore
          this.situation.demandeur,
          this.situation.conjoint,
          this.situation.enfants
        )
        .filter((individu) => individu)
    },
    ressourcesYearMinusTwoCaptured() {
      const yearMinusTwo = this.dates.fiscalYear.id
      const januaryYearMinusTwo = this.dates.fiscalYear12Months[0].id
      // @ts-ignore
      return this.peopleParentsFirst.some((individu: any) => {
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
    situation(): Situation {
      return generateSituation(this.simulation, true)
    },
  },
  state: () => defaultStore(),
})
