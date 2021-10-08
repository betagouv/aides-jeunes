import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import axios from "axios"
import moment from "moment"
import values from "lodash/values"
import some from "lodash/some"

import { computeAides, datesGenerator } from "../backend/lib/mes-aides"
import { categoriesRnc, patrimoineTypes } from "./constants/resources"
import { generateAllSteps, generateSituation } from "./lib/State/generator"
import Institution from "./lib/Institution"
import ABTestingService from "./plugins/ABTestingService"
import EtablissementModule from "./modules/Etablissement"

const INDIVIDU_DATE_FIELDS = [
  "date_naissance",
  "date_arret_de_travail",
  "date_debut_chomage",
  "plus_haut_diplome_date_obtention",
]

function adaptPersistedIndividu(individu) {
  INDIVIDU_DATE_FIELDS.forEach(function (dateField) {
    if (individu[dateField]) {
      individu[dateField] = new Date(individu[dateField])
    }
  })
}

function adaptPersistedSituation(situation) {
  if (situation.dateDeValeur) {
    situation.dateDeValeur = new Date(situation.dateDeValeur)
  }
  if (situation.demandeur) {
    adaptPersistedIndividu(situation.demandeur)
  }
  if (situation.enfants) {
    situation.enfants.forEach(adaptPersistedIndividu)
  }
  if (situation.conjoint) {
    adaptPersistedIndividu(situation.conjoint)
  }

  return situation
}

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
    dateDeValeur: new Date(),
    answers: {
      all: [],
      current: [],
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
  }
}

function restoreLocal() {
  let store
  if (window.sessionStorage.store) {
    store = JSON.parse(window.sessionStorage.store)
  }

  if (!store || !store.answers || !store.dateDeValeur) {
    store = defaultStore()
  }

  return {
    situationId: store.situationId,
    dateDeValeur: store.dateDeValeur,
    answers: store.answers || { all: [], current: [] },
    calculs: store.calculs || defaultCalculs(),
    dates: datesGenerator(store.dateDeValeur),
    ameliNoticationDone: store.ameliNoticationDone,
  }
}

const storeAnswer = (answers, newAnswer, clean) => {
  let found = false
  let i = 0
  while (!found && i < answers.length) {
    const answer = answers[i]
    if (
      answer.id === newAnswer.id &&
      answer.entityName === newAnswer.entityName &&
      answer.fieldName === newAnswer.fieldName
    ) {
      answer.value = newAnswer.value
      found = true
    }
    i++
  }
  let results
  if (!found) {
    results = [...answers, newAnswer]
  } else if (clean) {
    results = answers.slice(0, i)
  } else {
    results = [...answers]
  }

  return results
}

const store = new Vuex.Store({
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
      return generateAllSteps(getters.situation)
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
        menage.participation_frais === true
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
    fetchRepresentation: function (state, getters) {
      return function (representation, situationId) {
        return axios
          .get(
            `api/situations/${
              situationId || getters.situationId
            }/${representation}`
          )
          .then((response) => response.data)
      }
    },
    hasResults: function (state, getters) {
      return (
        getters.situationId &&
        state.calculs.resultats._id &&
        state.calculs.resultats._id === getters.situationId
      )
    },
    getAnswer: (state) => (id, entityName, fieldName) => {
      const answer = state.answers.all.find(
        (answer) =>
          answer.id === id &&
          answer.entityName === entityName &&
          answer.fieldName === fieldName
      )
      return answer ? answer.value : undefined
    },
    situation: (state) => {
      return generateSituation(state.answers, state.dates)
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
          answer.id === "demandeur" &&
          answer.fieldName === "nombre_enfants"
      )

      const currentAnswers =
        currentLastIndex === -1
          ? state.answers.current
          : state.answers.current.splice(0, currentLastIndex)

      state.answers = {
        enfants,
        all: storeAnswer(state.answers.all, answer, false),
        current: storeAnswer(currentAnswers, answer, true),
      }
    },
    setAmeliNoticationDone: function (state) {
      state.ameliNoticationDone = true
    },
    fetching: function (state) {
      state.access.fetching = true
    },
    reset: function (state, situation) {
      state.access.fetching = false
      state.situation = adaptPersistedSituation(situation)
      state.dates = datesGenerator(state.situation.dateDeValeur)
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
  },
  actions: {
    answer: ({ commit }, answer) => {
      commit("answer", answer)
      commit("setDirty")
    },
    ressourcesFiscales: ({ commit }, answer) => {
      commit("ressourcesFiscales", answer)
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
    updateError: function ({ commit }, error) {
      commit("saveError", error)
    },
    updateIndividu: function ({ commit }, individu) {
      commit("saveIndividu", individu)
      commit("setDirty")
    },
    save: function (store) {
      let situation = { ...store.getters.situation }
      if (store.situationId) {
        situation.modifiedFrom = store.state.situationId
      }

      situation.abtesting = ABTestingService.getEnvironment()
      return axios
        .post("/api/situations/", situation)
        .then((result) => result.data)
        .then((payload) => payload._id)
        .then((id) => store.commit("setId", id))
    },
    fetch: function (state, id) {
      state.commit("fetching")
      return axios
        .get(`/api/situations/${id}`)
        .then((result) => result.data)
        .then((payload) => state.commit("reset", payload))
        .catch(() => state.commit("saveAccessFailure"))
    },
    mockResults: function (state, benefit) {
      state.commit("setResults", Institution.mockResults(benefit))
    },
    compute: function (store, showPrivate) {
      store.commit("startComputation")
      return axios
        .get(
          "api/situations/" + store.state.situationId + "/openfisca-response"
        )
        .then(function (OpenfiscaResponse) {
          return OpenfiscaResponse.data
        })
        .then(function (openfiscaResponse) {
          return computeAides.bind(Institution)(
            store.getters.situation,
            openfiscaResponse,
            showPrivate
          )
        })
        .then((results) => {
          const hasRsa =
            some(results.droitsEligibles, (i) => i.id === "rsa") ||
            some(results.droitsInjectes, (i) => i.id === "rsa" && i.montant)
          if (hasRsa) {
            Institution.forEachBenefit((benefit, id, provider) => {
              if (!benefit.test) {
                return
              }
              results.droitsEligibles.unshift({
                ...benefit,
                id,
                provider,
                montant: true,
                top: 0,
              })
            })
          }

          return results
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
    verifyBenefitVariables: function (state) {
      return axios
        .get("api/openfisca/variables")
        .then((response) => response.data)
        .then((variableNames) => {
          let missingBenefits = []
          Institution.forEachBenefit((benefit, benefitId) => {
            const source = benefit.openfisca_eligibility_source || benefitId
            if (
              !benefit.test &&
              !benefit.computesLocally &&
              !variableNames.includes(source)
            ) {
              missingBenefits.push(benefitId)
            }
          })

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
store._vm.$watch(
  function () {
    return this._data.$$state
  },
  () => {
    if (!store._committing) {
      throw "Do not mutate vuex store state outside mutation handlers."
    }
  },
  { deep: true, sync: true }
)
