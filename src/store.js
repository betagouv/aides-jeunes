//import Vue from "vue"
//import Vuex from "vuex"
import { createStore } from 'vuex'
//Vue.use(Vuex)

import axios from "axios"
import moment from "moment"
import values from "lodash/values"
import some from "lodash/some"

import { computeAides, datesGenerator } from "../lib/Benefits/Compute"
import { categoriesRnc, patrimoineTypes } from "../lib/Resources"
import { generateAllSteps } from "./lib/State/generator"
import Institution from "./lib/Institution"
import ABTestingService from "./plugins/ABTestingService"
import EtablissementModule from "./modules/Etablissement"
import { generateSituation } from "../lib/situations"

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
    answers: {
      all: [],
      current: [],
      dateDeValeur: new Date(),
      version: 3,
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
  }
}

function restoreLocal() {
  let store
  if (window.sessionStorage.store) {
    store = JSON.parse(window.sessionStorage.store)
  }

  if (!store || !store.answers || !store.answers.dateDeValeur) {
    store = defaultStore()
  }

  return {
    situationId: store.situationId,
    answers: store.answers,
    calculs: store.calculs || defaultCalculs(),
    dates: datesGenerator(store.answers.dateDeValeur),
    ameliNoticationDone: store.ameliNoticationDone,
  }
}

const storeAnswer = (answers, newAnswer, clean) => {
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
      if (newAnswer.id && newAnswer.id.startsWith("enfant_")) {
        // If we are changing info about a children
        // we want to keep the answer on others
        results = answers
          .slice(0, existingAnswerIndex + 1)
          .concat(
            answers.filter(
              (answer) =>
                answer.id.startsWith("enfant_") && answer.id !== newAnswer.id
            )
          )
      } else {
        results = answers.slice(0, existingAnswerIndex + 1)
      }
    } else {
      results = [...answers]
    }
  }

  return results
}

const store = createStore({
  state: defaultStore(),
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
      return generateAllSteps(getters.situation, state.openFiscaParameters)
    },
    ressourcesYearMinusTwoCaptured: function (state, getters) {
      const yearMinusTwo = state.dates.fiscalYear.id
      const januaryYearMinusTwo = state.dates.fiscalYear12Months[0].id
      return getters.peopleParentsFirst.some(function (individu) {
        return categoriesRnc.reduce(function (
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

      return patrimoineTypes.reduce(function (accum, ressource) {
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
            `api/answers/${situationId || state.situationId}/${representation}`
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
    getAnswer: (state) => (id, entityName, fieldName, currentOnly) => {
      const answer = (
        currentOnly ? state.answers.current : state.answers.all
      ).find(
        (answer) =>
          answer.id === id &&
          answer.entityName === entityName &&
          answer.fieldName === fieldName
      )
      return answer ? answer.value : undefined
    },
    situation: (state) => {
      return generateSituation(state.answers)
    },
  },
  mutations: {
    answer: (state, answer) => {
      state.answers = {
        ...state.answers,
        all: storeAnswer(state.answers.all, answer, false),
        current: storeAnswer(state.answers.current, answer, true),
      }
    },
    ressourcesFiscales: (state, ressourcesFiscales) => {
      state.answers = {
        ...state.answers,
        ressourcesFiscales,
      }
    },
    patrimoine: (state, patrimoine) => {
      state.answers = {
        ...state.answers,
        patrimoine,
      }
    },
    clear: function (state) {
      state.answers = { all: [], current: [], enfants: [] }
      state.access.forbidden = false
      state.access.fetching = false
    },
    setDebug: function (state, debug) {
      state.debug = debug
    },
    initialize: function (state) {
      Object.assign(state, restoreLocal(), { saveSituationError: null })
    },
    removeEnfant: function (state, id) {
      const enfantIndex = id.split("_")[1]
      state.answers = {
        ...state.answers,
        enfants: state.answers.enfants.filter((i) => i != enfantIndex),
      }
    },
    saveIndividu: function () {},
    saveError: function (state, error) {
      state.error = error
    },
    addEnfant: function (state) {
      let enfantId
      let enfants
      if (state.answers.enfants && state.answers.enfants.length > 0) {
        enfantId = state.answers.enfants[state.answers.enfants.length - 1] + 1
        enfants = [...state.answers.enfants, enfantId]
      } else {
        enfantId = 0
        enfants = [enfantId]
      }
      const answer = {
        entityName: "individu",
        id: `enfant_${enfantId}`,
        fieldName: "_firstName",
        value:
          "votre " +
          enfants.length +
          (enfants.length === 1 ? "ᵉʳ" : "ᵉ") +
          " enfant",
      }

      // When you add a children you need to remove all current answer after the child validation
      const currentLastIndex = state.answers.current.findIndex(
        (answer) =>
          answer.entityName === "individu" &&
          answer.id === "nombre_enfants" &&
          answer.fieldName === "nombre_enfants"
      )

      const currentAnswers =
        currentLastIndex === -1
          ? state.answers.current
          : state.answers.current.splice(0, currentLastIndex)

      state.answers = {
        ...state.answers,
        enfants,
        all: storeAnswer(state.answers.all, answer, false),
        current: storeAnswer(currentAnswers, answer, true),
      }
    },
    editEnfant: function (state, id) {
      // When you edit a children you need to remove all current answer after the child validation
      const currentLastIndex = state.answers.current.findIndex(
        (answer) =>
          answer.entityName === "individu" &&
          answer.id === "nombre_enfants" &&
          answer.fieldName === "nombre_enfants"
      )

      const currentAnswers =
        currentLastIndex === -1
          ? state.answers.current
          : state.answers.current.splice(0, currentLastIndex)

      state.answers = {
        ...state.answers,
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
    reset: function (state, answers) {
      state.access.fetching = false
      state.answers = answers
      state.dates = datesGenerator(answers.dateDeValeur || new Date())
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
  },
  actions: {
    answer: ({ commit }, answer) => {
      commit("answer", answer)
      commit("setDirty")
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
      let answers = { ...store.state.answers, _id: undefined }
      if (store.situationId) {
        answers.modifiedFrom = store.state.situationId
      }

      answers.abtesting = ABTestingService.getEnvironment()
      return axios
        .post("/api/answers", answers)
        .then((result) => result.data)
        .then((payload) => payload._id)
        .then((id) => store.commit("setId", id))
    },
    fetch: function (state, id) {
      state.commit("fetching")
      return axios
        .get(`/api/answers/${id}`)
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
        .get("api/answers/" + store.state.situationId + "/openfisca-response")
        .then(function (OpenfiscaResponse) {
          return OpenfiscaResponse.data
        })
        .then(function (openfiscaResponse) {
          return computeAides.bind(Institution)(
            store.getters.situation,
            store.state.situationId,
            openfiscaResponse,
            showPrivate
          )
        })
        .then((results) => store.commit("setResults", results))
        .catch((error) => store.commit("saveComputationFailure", error))
    },
    redirection: function (state, next) {
      state.commit(
        "setMessage",
        'Vous avez été redirigé·e sur la première page du simulateur. Vous pensez que c\'est une erreur&nbsp;? Contactez-nous&nbsp: <a href="mailto:aides-jeunes@beta.gouv.fr">aides-jeunes@beta.gouv.fr</a>.'
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
      answers,
      enfants,
      ameliNoticationDone,
      calculs,
      dateDeValeur,
      situationId,
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
        answers,
        enfants,
        ameliNoticationDone,
        calculs,
      })
    )
  }
)

// Replicate strict mode
// store._vm.$watch(
//   function () {
//     return this._data.$$state
//   },
//   () => {
//     if (!store._committing) {
//       throw "Do not mutate vuex store state outside mutation handlers."
//     }
//   },
//   { deep: true, sync: true }
// )
