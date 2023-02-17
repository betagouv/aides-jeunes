import { defineStore } from "pinia"
import dayjs from "dayjs"
import { version } from "@lib/simulation"
import { generator as datesGenerator } from "@lib/dates"
import { generateAllSteps } from "@lib/state/generator"
import { getAnswer, isStepAnswered, storeAnswer } from "@lib/answers.ts"
import { categoriesRnc, patrimoineTypes } from "@lib/resources.ts"
import isEqual from "lodash.isequal"
import axios from "axios"
import { generateSituation } from "@lib/situations"
import ABTestingService from "@/plugins/ab-testing-service.js"
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
    resultats: {
      _id: undefined,
      droitsEligibles: null,
      droitsInjectes: null,
    },
    dirty: false,
    error: false,
    exception: false,
    updating: false,
  }
}

function defaultStore(): Store {
  const now = dayjs().format()

  return {
    simulationId: null,
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
    title: null,
    themeColor: null,
    inIframe: false,
    iframeOrigin: null,
    iframeHeaderCollapse: false,
    saveSituationError: null,
    openFiscaParameters: {},
    recapEmailState: undefined,
    external_id: undefined,
  }
}

function getPersitedStateProperties(
  state: Store,
  save = false
): PersistedStore {
  const persistedStoreData: PersistedStore = {
    simulationId: state.simulationId,
    simulation: state.simulation,
    calculs: state.calculs || defaultCalculs(),
    ameliNoticationDone: state.ameliNoticationDone,
    recapEmailState: state.recapEmailState,
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
  state: () => defaultStore(),
  getters: {
    passSanityCheck(): boolean {
      return Boolean(
        this.situation.demandeur && this.situation.demandeur.date_naissance
      )
    },
    getDebug(): boolean {
      return this.debug
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
    getAllSteps(): any[] {
      return generateAllSteps(this.situation, this.openFiscaParameters)
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
    isProprietaireAvecPretEnCours(): boolean {
      const menage = this.situation.menage
      const isProprietaire = ["primo_accedant", "proprietaire"].includes(
        menage.statut_occupation_logement
      )
      return isProprietaire && menage.loyer > 0
    },
    isHebergeParticipeFrais(): boolean {
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
    hasPatrimoine(): any {
      const demandeur = this.situation.demandeur
      if (!demandeur) {
        return undefined
      }

      return patrimoineTypes.reduce((accum, ressource) => {
        if (!demandeur[ressource.id]) {
          return accum
        }
        return (
          accum || Object.values(demandeur[ressource.id]).some((value) => value)
        )
      }, undefined)
    },
    fetchRepresentation() {
      return (representation: string, simulationId: string) => {
        return axios
          .get(
            `/api/simulation/${
              simulationId || this.simulationId
            }/${representation}`
          )
          .then((response) => response.data)
      }
    },
    hasResults(): boolean {
      return Boolean(
        this.simulationId &&
          this.calculs.resultats._id &&
          this.calculs.resultats._id === this.simulationId
      )
    },
    situation(): Situation {
      return generateSituation(this.simulation, true)
    },
  },
  actions: {
    setDirty() {
      this.calculs.dirty = true
    },
    answer(answer: Answer) {
      const simulationAnswerValue = getAnswer(
        this.simulation.answers.all,
        answer.entityName,
        answer.fieldName,
        answer.id
      )
      if (!isEqual(simulationAnswerValue, answer.value)) {
        this.setDirty()
        this.updateAnswerSimulation(answer)
      }
    },
    updateAnswerSimulation(answer: Answer) {
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
    ressourcesFiscales(ressourcesFiscales: any) {
      this.simulation = {
        ...this.simulation,
        ressourcesFiscales,
      }
      this.setDirty()
    },
    setPatrimoine(patrimoine: any) {
      this.simulation.patrimoine = patrimoine
      this.setDirty()
    },
    deleteSituationId() {
      delete this.situationId
    },
    migrateSituationIdToSimulationId() {
      if (this.situationId) {
        this.setSimulationId(this.situationId)
        this.deleteSituationId()
      }
    },
    initialize() {
      Object.assign(this, restoreLocal(), { saveSituationError: null })
    },
    resetSimulation() {
      const state = defaultStore()

      const newStore = getPersitedStateProperties(state)
      Object.assign(this, newStore)
    },
    clear(external_id: string) {
      this.access.forbidden = false
      this.access.fetching = false

      this.resetSimulation()

      this.external_id = external_id
    },
    setDebug(debug: boolean) {
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
        path: `/simulation/individu/enfant_${enfantId}/_firstName`,
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
    removeEnfant(id: string) {
      const enfantIndex = parseInt(id.split("_")[1])
      this.simulation = {
        ...this.simulation,
        enfants: this.simulation.enfants?.filter((i) => i !== enfantIndex),
      }
      this.setDirty()
    },
    updateError(error: string) {
      this.error = error
    },
    setRecapEmailState(newState: string | undefined) {
      this.recapEmailState = newState
    },
    setSimulationId(id: string) {
      this.simulationId = id
      this.calculs.dirty = false
    },
    save() {
      this.setRecapEmailState(undefined)

      const simulation = { ...this.simulation, _id: undefined }
      if (this.simulationId) {
        simulation.modifiedFrom = this.simulationId
      }

      simulation.abtesting = ABTestingService.getValues()
      simulation.finishedAt = new Date()
      return axios
        .post("/api/simulation", simulation)
        .then((result) => result.data)
        .then((payload) => payload._id)
        .then((id) => this.setSimulationId(id))
    },
    reset(simulation: Simulation) {
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
    fetch(id: string) {
      this.setRecapEmailState(undefined)

      this.access.fetching = true

      return axios
        .get(`/api/simulation/${id}`)
        .then((result) => result.data)
        .then((payload) => this.reset(payload))
        .then(() => this.setSimulationId(id))
        .catch((e) => {
          console.log(e)
          this.saveAccessFailure()
        })
    },
    setResults(results: Resultats) {
      this.calculs.resultats = results
      this.calculs.updating = false
    },
    async mockResults(benefit: any) {
      const { mockResults } = await import("@/lib/benefits.js")
      // @ts-ignore
      this.setResults(mockResults(benefit))
    },
    startComputation() {
      this.calculs.updating = true
      this.calculs.exception = false
      this.calculs.error = false
    },
    saveComputationFailure(error: any) {
      this.calculs.updating = false
      this.calculs.error = true
      this.calculs.exception = (error.response && error.response.data) || error
    },
    compute(showPrivate: boolean) {
      this.startComputation()

      return axios
        .get(
          `/api/simulation/${this.simulationId}/results${
            showPrivate ? "&showPrivate" : ""
          }`
        )
        .then((response) => {
          return response.data
        })
        .then((results) => this.setResults(results as Resultats))
        .catch((error) => {
          this.saveComputationFailure(error)
        })
    },
    setMessage(message: string, counter?: number) {
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
    redirection(next: (path: string) => void) {
      this.setMessage(
        `Vous avez été redirigé·e sur la première page du simulateur. Vous pensez que c'est une erreur&nbsp;? Contactez-nous&nbsp: <a href="mailto:${process.env.VITE_CONTACT_EMAIL}">${process.env.VITE_CONTACT_EMAIL}</a>.`
      )
      next("/simulation")
    },
    setOpenFiscaParameters() {
      // @ts-ignore
      const date = new Date(this.simulation.dateDeValeur)
      return axios
        .get(`/api/openfisca/parameters/${date.toISOString()}`)
        .then((response) => {
          this.openFiscaParameters = response.data
        })
    },
    verifyBenefitVariables() {
      return axios
        .get("/api/openfisca/missingbenefits")
        .then((response) => response.data)
        .then((missingBenefits) => {
          if (Array.isArray(missingBenefits) && missingBenefits.length > 0) {
            this.setMessage(
              `🚀 Vous avez ajouté <abbr title="${missingBenefits.join(
                ", "
              )}">une nouvelle aide</abbr>&nbsp;!<br/>Étant donné que nous ne savons pas encore comm


ent celle-ci doit être calculée, si vous faites votre simulation jusqu’au bout vous obtiendrez un message d’erreur.`
            )
          }
        })
    },
    setSaveSituationError(saveSituationError: string) {
      this.saveSituationError = saveSituationError
    },
    setAmeliNoticationDone() {
      this.ameliNoticationDone = true
    },
    setIframeOrigin(newOrigin: string) {
      this.inIframe = true
      this.iframeOrigin = newOrigin
    },
    setIframeHeaderCollapse(collapse = false) {
      this.iframeHeaderCollapse = collapse
    },
    setThemeColor(themeColor: string) {
      this.themeColor = themeColor
    },
    setTitle(newTitle: string) {
      this.title = newTitle
    },
  },
})
