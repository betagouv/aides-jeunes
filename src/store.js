import { createStore } from "vuex"

import axios from "axios"
import moment from "moment"
import values from "lodash/values"
import some from "lodash/some"

import * as compute from "../lib/benefits/compute"
import * as resources from "../lib/resources"
import * as generator from "../lib/state/generator"
import Institution from "./lib/institution"
import ABTestingService from "./plugins/ab-testing-service"
import EtablissementModule from "./modules/etablissement"
import * as answers from "../lib/answers"
import * as situations from "../lib/situations"
import * as simulation from "../lib/simulation"

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
  const now = moment().format()

  return {
    situationId: null,
    simulation: {
      answers: {
        all: [],
        current: [],
      },
      dateDeValeur: new Date(),
      simulation: simulation.version,
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
    dates: compute.datesGenerator(now),
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

function restoreLocal() {
  let store
  if (window.sessionStorage.store) {
    store = JSON.parse(window.sessionStorage.store)
  }

  if (!store || !store.simulation || !store.simulation.dateDeValeur) {
    store = defaultStore()
  }

  return {
    situationId: store.situationId,
    simulation: store.simulation,
    calculs: store.calculs || defaultCalculs(),
    dates: compute.datesGenerator(store.simulation.dateDeValeur),
    ameliNoticationDone: store.ameliNoticationDone,
    recapEmailState: store.recapEmailState,
  }
}

const storeAnswer = (answers, newAnswer, clean, enfants) => {
  const existingAnswerIndex = answers.findIndex(
    (answer) =>
      answer.id === newAnswer.id &&
      answer.entityName === newAnswer.entityName &&
      answer.fieldName === newAnswer.fieldName
  )
  let results
  if (existingAnswerIndex === -1) {
    results = [...answers, newAnswer]
  } else {
    const answer = answers[existingAnswerIndex]
    answer.value = newAnswer.value
    if (clean) {
      // Keep all answers related to children because they are not on the same path
      const allowedAnswered = enfants
        ? enfants
            .map((enfant) => `enfant_${enfant}`)
            .filter((id) => id !== newAnswer.id)
        : []
      results = answers.slice(0, existingAnswerIndex + 1)
      results = results.concat(
        answers.filter(
          (answer) =>
            allowedAnswered.includes(answer.id) &&
            results.find((result) => result.id !== answer.id)
        )
      )
    } else {
      results = [...answers]
    }
  }

  return results
}

const store = createStore({
  state: defaultStore(),
  strict: process.env.NODE_ENV !== "production",
  getters: {
    passSanityCheck: function (state, getters) {
      return (
        getters.situation.demandeur &&
        getters.situation.demandeur.date_naissance
      )
    },
    getDebug: function (state) {
      return state.debug
    },
    peopleParentsFirst: function (state, getters) {
      return []
        .concat(
          getters.situation.demandeur,
          getters.situation.conjoint,
          getters.situation.enfants
        )
        .filter((individu) => individu)
    },
    getIndividu: function (state, getters) {
      return (id) => {
        let items = getters.peopleParentsFirst.filter((i) => i.id == id)
        return items.length ? items[0] : null
      }
    },
    getAllSteps: function (state, getters) {
      return generator.generateAllSteps(
        getters.situation,
        state.openFiscaParameters
      )
    },
    getAllAnsweredSteps: function (state, getters) {
      const allSteps = getters.getAllSteps.filter(
        (step) =>
          step.path !== "/" &&
          step.path !== "/simulation/resultats" &&
          step.isActive
      )
      return allSteps.filter((step) =>
        answers.isStepAnswered(state.simulation.answers.all, step)
      )
    },
    lastUnansweredStep: function (state, getters) {
      const allSteps = getters.getAllSteps.filter(
        (step) =>
          step.path !== "/" &&
          step.path !== "/simulation/resultats" &&
          step.isActive
      )
      return allSteps.find(
        (step) => !answers.isStepAnswered(state.simulation.answers.all, step)
      )
    },
    ressourcesYearMinusTwoCaptured: function (state, getters) {
      const yearMinusTwo = state.dates.fiscalYear.id
      const januaryYearMinusTwo = state.dates.fiscalYear12Months[0].id
      return getters.peopleParentsFirst.some(function (individu) {
        return resources.categoriesRnc.reduce(function (
          hasYm2RessourcesAccum,
          categorieRnc
        ) {
          if (!individu[categorieRnc.id]) {
            return hasYm2RessourcesAccum
          }

          return (
            hasYm2RessourcesAccum ||
            typeof individu[categorieRnc.id][yearMinusTwo] == "number" ||
            typeof individu[categorieRnc.id][januaryYearMinusTwo] == "number"
          )
        },
        false)
      })
    },
    isProprietaireAvecPretEnCours: function (state, getters) {
      let menage = getters.situation.menage
      let isProprietaire = ["primo_accedant", "proprietaire"].includes(
        menage.statut_occupation_logement
      )
      return isProprietaire && menage.loyer > 0
    },
    isHebergeParticipeFrais: function (state, getters) {
      let menage = getters.situation.menage
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
    hasPatrimoine: function (state, getters) {
      let demandeur = getters.situation.demandeur
      if (!demandeur) {
        return undefined
      }

      return resources.patrimoineTypes.reduce(function (accum, ressource) {
        if (!demandeur[ressource.id]) {
          return accum
        }

        return accum || some(values(demandeur[ressource.id]))
      }, undefined)
    },
    fetchRepresentation: function (state) {
      return function (representation, situationId) {
        return axios
          .get(
            `api/simulation/${
              situationId || state.situationId
            }/${representation}`
          )
          .then((response) => response.data)
      }
    },
    hasResults: function (state) {
      return (
        state.situationId &&
        state.calculs.resultats._id &&
        state.calculs.resultats._id === state.situationId
      )
    },
    situation: (state) => {
      return situations.generateSituation(state.simulation, true)
    },
  },
  mutations: {
    answer: (state, answer) => {
      state.simulation.answers = {
        ...state.simulation.answers,
        all: storeAnswer(state.simulation.answers.all, answer, false),
        current: storeAnswer(
          state.simulation.answers.current,
          answer,
          true,
          state.simulation.enfants
        ),
      }
    },
    updateCurrentAnswers: (state, { newPath, steps }) => {
      const currentAnswers = []
      let i = 0
      let currentStep = steps[0]
      while (currentStep && currentStep.path !== newPath) {
        if (currentStep.isActive && currentStep.path !== "/") {
          const currentAnswer = state.simulation.answers.all.find((answer) => {
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
      state.simulation.answers.current = currentAnswers
    },
    ressourcesFiscales: (state, ressourcesFiscales) => {
      state.simulation = {
        ...state.simulation,
        ressourcesFiscales,
      }
    },
    patrimoine: (state, patrimoine) => {
      state.simulation = {
        ...state.simulation,
        patrimoine,
      }
    },
    clear: function (state) {
      state.simulation = {
        answers: { all: [], current: [] },
        enfants: [],
      }
      state.access.forbidden = false
      state.access.fetching = false
    },
    setDebug: function (state, debug) {
      state.debug = debug
    },
    initialize: function (state) {
      Object.assign(state, restoreLocal(), { saveSituationError: null })
    },
    saveIndividu: function () {},
    saveError: function (state, error) {
      state.error = error
    },
    removeEnfant: function (state, id) {
      const enfantIndex = id.split("_")[1]
      state.simulation = {
        ...state.simulation,
        enfants: state.simulation.enfants.filter((i) => i != enfantIndex),
      }
    },
    addEnfant: function (state) {
      let enfantId
      let enfants
      if (state.simulation.enfants && state.simulation.enfants.length > 0) {
        enfantId =
          state.simulation.enfants[state.simulation.enfants.length - 1] + 1
        enfants = [...state.simulation.enfants, enfantId]
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
      const currentLastIndex = state.simulation.answers.current.findIndex(
        (answer) => answer.entityName === "enfants"
      )

      const currentAnswers =
        currentLastIndex === -1
          ? state.simulation.answers.current
          : state.simulation.answers.current.splice(0, currentLastIndex)

      state.simulation = {
        ...state.simulation,
        enfants,
        answers: {
          all: storeAnswer(state.simulation.answers.all, answer, false),
          current: storeAnswer(
            currentAnswers,
            answer,
            true,
            state.simulation.enfants
          ),
        },
      }
    },
    editEnfant: function (state, id) {
      // When you edit a children you need to remove all current answer after the child validation
      const currentLastIndex = state.simulation.answers.current.findIndex(
        (answer) => answer.entityName === "enfants"
      )

      const currentAnswers =
        currentLastIndex === -1
          ? state.simulation.answers.current
          : state.simulation.answers.current.splice(0, currentLastIndex)

      state.simulation.answers = {
        ...state.simulation.answers,
        current: currentAnswers.filter(
          (answer) => answer.id !== `enfant_${id}`
        ),
      }
    },
    setAmeliNoticationDone: function (state) {
      state.ameliNoticationDone = true
    },
    fetching: function (state) {
      state.access.fetching = true
    },
    reset: function (state, simulation) {
      state.access.fetching = false
      state.simulation = simulation
      state.dates = compute.datesGenerator(
        simulation.dateDeValeur || new Date()
      )
      state.ameliNoticationDone = false
      state.calculs.dirty = false
    },
    saveAccessFailure: function (state) {
      state.access.fetching = false
      state.access.forbidden = true
    },
    setId: function (state, id) {
      state.situationId = id
      state.calculs.dirty = false
    },
    setExternalId: function (state, id) {
      state.external_id = id
    },
    startComputation: function (state) {
      state.calculs.updating = true
      state.calculs.exception = false
      state.calculs.error = false
    },
    setResults: function (state, results) {
      state.calculs.resultats = results
      state.calculs.updating = false
    },
    saveComputationFailure: function (state, error) {
      state.calculs.updating = false
      state.calculs.error = true
      state.calculs.exception = (error.response && error.response.data) || error
    },
    setMessage: function (state, message, counter) {
      state.message = {
        text: message,
        counter: counter || 1,
      }
    },
    decrementMessageRemainingViewTime: function (state) {
      if (!state.message.text) {
        return
      }

      state.message.counter = state.message.counter - 1
      if (state.message.counter < 0) {
        state.message.text = null
      }
    },
    setTitle: function (state, newTitle) {
      state.title = newTitle
    },
    setDirty: function (state) {
      state.calculs.dirty = true
    },
    setThemeColor: function (state, themeColor) {
      state.themeColor = themeColor
    },

    setIframeOrigin: function (state, newOrigin) {
      state.inIframe = true
      state.iframeOrigin = newOrigin
    },
    setSaveSituationError: function (state, saveSituationError) {
      state.saveSituationError = saveSituationError
    },
    openFiscaParameters: function (state, parameters) {
      state.openFiscaParameters = parameters
    },
    setRecapEmailState: function (state, newState) {
      state.recapEmailState = newState
    },
  },
  actions: {
    answer: ({ commit }, answer) => {
      commit("answer", answer)
      commit("setDirty")
    },
    updateCurrentAnswers: ({ commit, getters }, newPath) => {
      commit("updateCurrentAnswers", {
        newPath,
        steps: getters.getAllSteps,
      })
    },
    ressourcesFiscales: ({ commit }, ressourcesFiscales) => {
      commit("ressourcesFiscales", ressourcesFiscales)
      commit("setDirty")
    },
    patrimoine: ({ commit }, patrimoine) => {
      commit("patrimoine", patrimoine)
      commit("setDirty")
    },
    clear: function ({ commit }, external_id) {
      commit("clear")
      commit("initialize")
      commit("setExternalId", external_id)
    },
    setDebug: function ({ commit }, debug) {
      commit("setDebug", debug)
    },
    initialize: function ({ commit }) {
      commit("initialize")
    },
    removeEnfant: function ({ commit }, id) {
      commit("removeEnfant", id)
      commit("setDirty")
    },
    addEnfant: function ({ commit }) {
      commit("addEnfant")
      commit("setDirty")
    },
    editEnfant: function ({ commit }, id) {
      commit("editEnfant", id)
      commit("setDirty")
    },
    updateError: function ({ commit }, error) {
      commit("saveError", error)
    },
    updateIndividu: function ({ commit }, individu) {
      commit("saveIndividu", individu)
      commit("setDirty")
    },
    save: function (store) {
      store.commit("setRecapEmailState", undefined)
      let simulation = { ...store.state.simulation, _id: undefined }
      if (store.situationId) {
        simulation.modifiedFrom = store.state.situationId
      }

      simulation.abtesting = ABTestingService.getEnvironment()
      return axios
        .post("/api/simulation", simulation)
        .then((result) => result.data)
        .then((payload) => payload._id)
        .then((id) => store.commit("setId", id))
    },
    fetch: function (state, id) {
      store.commit("setRecapEmailState", undefined)
      state.commit("fetching")
      return axios
        .get(`/api/simulation/${id}`)
        .then((result) => result.data)
        .then((payload) => state.commit("reset", payload))
        .then(() => store.commit("setId", id))
        .catch((e) => {
          console.log(e)
          state.commit("saveAccessFailure")
        })
    },
    mockResults: function (state, benefit) {
      state.commit("setResults", Institution.mockResults(benefit))
    },
    compute: function (store, showPrivate) {
      store.commit("startComputation")
      return axios
        .get(`api/simulation/${store.state.situationId}/openfisca-response`)
        .then(function (OpenfiscaResponse) {
          return OpenfiscaResponse.data
        })
        .then(function (openfiscaResponse) {
          return compute.computeAides.bind(Institution.benefits)(
            store.getters.situation,
            store.state.situationId,
            openfiscaResponse,
            showPrivate
          )
        })
        .then((results) => store.commit("setResults", results))
        .catch((error) => {
          store.commit("saveComputationFailure", error)
        })
    },
    redirection: function (state, next) {
      state.commit(
        "setMessage",
        `Vous avez été redirigé·e sur la première page du simulateur. Vous pensez que c'est une erreur&nbsp;? Contactez-nous&nbsp: <a href="mailto:${process.env.VUE_APP_CONTACT_EMAIL}">${process.env.VUE_APP_CONTACT_EMAIL}</a>.`
      )
      next("/simulation")
    },
    openFiscaParameters: function (state) {
      const date = new Date(state.getters.situation.dateDeValeur)
      return axios
        .get(`api/openfisca/parameters/${date.toISOString()}`)
        .then((response) => state.commit("openFiscaParameters", response.data))
    },
    verifyBenefitVariables: function (state) {
      return axios
        .get("api/openfisca/missingbenefits")
        .then((response) => response.data)
        .then((missingBenefits) => {
          if (missingBenefits.length) {
            state.commit(
              "setMessage",
              `🚀 Vous avez ajouté <abbr title="${missingBenefits.join(
                ", "
              )}">une nouvelle aide</abbr>&nbsp;!<br/>Étant donné que nous ne savons pas encore comment celle-ci doit être calculée, si vous faites votre simulation jusqu’au bout vous obtiendrez un message d’erreur.`
            )
          }
        })
    },
  },
  modules: {
    etablissementsSearch: EtablissementModule,
  },
})
export default store

store.subscribe(
  (
    { type },
    {
      simulation,
      enfants,
      ameliNoticationDone,
      calculs,
      dateDeValeur,
      situationId,
      recapEmailState,
    }
  ) => {
    if (type === "initialize") {
      return
    }
    window.sessionStorage.setItem(
      "store",
      JSON.stringify({
        dateDeValeur,
        situationId,
        simulation,
        enfants,
        ameliNoticationDone,
        calculs,
        recapEmailState,
      })
    )
  }
)
