import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

import { computeAides, datesGenerator } from '../backend/lib/mes-aides'
import { categoriesRnc, patrimoineTypes } from './constants/resources'

var DATE_FIELDS = ['date_naissance', 'date_arret_de_travail', 'date_debut_chomage'];

function adaptPersistedIndividu(individu) {
    DATE_FIELDS.forEach(function(dateField) {
        if (individu[dateField]) {
            individu[dateField] = new Date(individu[dateField]);
        }
    });
}

function adaptPersistedSituation(situation) {
    if (situation.dateDeValeur) {
        situation.dateDeValeur = new Date(situation.dateDeValeur);
    }
    if (situation.demandeur) {
        adaptPersistedIndividu(situation.demandeur);
    }
    if (situation.enfants) {
        situation.enfants.forEach(adaptPersistedIndividu);
    }
    if (situation.conjoint) {
        adaptPersistedIndividu(situation.conjoint);
    }
    return situation;
}

function defaultStore() {
  const now = moment().format()
  return {
    message: null,
    situation: {
      _id: null,
      dateDeValeur: now,
      enfants: [],
      famille: {},
      foyer_fiscal: {},
      menage: {
        aide_logement_date_pret_conventionne: '2017-12-31'
      },
      version: 13,
    },
    access: {
      fetching: false,
      forbidden: false,
    },
    calculs: {
      resultats: {
        droitsEligibles: null,
        droitsNonEligibles: null,
        droitsInjectes: null,
      },
      error: false,
      exception: false,
      updating: false,
    },
    dates: datesGenerator(now),
    ameliNoticationDone: false,
    title: null,
  }
}

function restoreLocal() {
  let store
  if (window.sessionStorage.store) {
    store = JSON.parse(window.sessionStorage.store)
  }

  if (!store || !store.situation || !store.situation.dateDeValeur) {
    store = defaultStore()
  }

  return {
    situation: adaptPersistedSituation(store.situation),
    dates: datesGenerator(store.situation.dateDeValeur),
    ameliNoticationDone: store.ameliNoticationDone
  }
}

const store = new Vuex.Store({
  state: defaultStore(),
  getters: {
    passSanityCheck: function(state) {
        return state.situation.demandeur && state.situation.demandeur.date_naissance
    },
    peopleParentsFirst: function(state) {
      return [].concat(
          state.situation.demandeur,
          state.situation.conjoint,
          state.situation.enfants,
      ).filter(function(individu) { return individu; });
    },
    ressourcesYearMinusTwoCaptured: function(state, getters) {
      const yearMinusTwo = state.dates.fiscalYear.id
      const januaryYearMinusTwo = state.dates.fiscalYear12Months[0].id
      return getters.peopleParentsFirst.some(function(individu) {
          return categoriesRnc.reduce(function(hasYm2RessourcesAccum, categorieRnc) {
              if (! individu[categorieRnc.id]) {
                  return hasYm2RessourcesAccum
              }

              return hasYm2RessourcesAccum ||
                  typeof individu[categorieRnc.id][yearMinusTwo] == 'number' ||
                  typeof individu[categorieRnc.id][januaryYearMinusTwo] == 'number'
          }, false)
      })
    },
    /* This function returns
     * - undefined if demandeur do not have any patrimoine ressource
     * - false if those ressources are all null else
     * - true
     */
    hasPatrimoine: function(state) {
        var demandeur = state.situation.demandeur
        return patrimoineTypes.reduce(function(accum, ressource) {
            if (! demandeur[ressource.id]) {
                return accum
            }

            return accum || _.some(_.values(demandeur[ressource.id]))

        }, undefined)
    },
  },
  mutations: {
    clear: function(state) {
      state.situation = {}
      state.access.forbidden = false
      state.access.fetching = false
    },
    initialize: function(state) {
      const { situation, dates, ameliNoticationDone } = restoreLocal()
      state.situation = situation
      state.dates = dates
      state.ameliNoticationDone = ameliNoticationDone
    },
    updateFamille: function(state, famille) {
      state.situation = Object.assign({}, state.situation, { famille })
    },
    updateMenage: function(state, menage) {
      state.situation = Object.assign({}, state.situation, { menage })
    },
    removeConjoint: function(state) {
      const s = Object.assign({}, state.situation)
      delete s.conjoint
      state.situation = s
    },
    removeEnfant: function(state, id) {
      state.situation.enfants = state.situation.enfants.filter((e) => e.id !== id)
    },
    updateIndividu: function(state, individu) {
      if (individu.id === 'demandeur') {
        state.situation = Object.assign({}, state.situation, { demandeur: individu })
      } else if (individu.id === 'conjoint') {
        state.situation = Object.assign({}, state.situation, { conjoint: individu })
      } else {
        const idx = _.findIndex(state.situation.enfants, { id: individu.id })
        state.situation.enfants.splice(idx, 1, individu)
      }
    },
    addEnfant: function(state, enfant) {
      state.situation.enfants.push(enfant)
    },
    setAmeliNoticationDone: function(state) {
      state.ameliNoticationDone = true
    },
    fetching: function(state) {
      state.access.fetching = true
    },
    reset: function(state, situation) {
      state.access.fetching = false
      state.situation = adaptPersistedSituation(situation)
      state.dates = datesGenerator(state.situation.dateDeValeur)
      state.ameliNoticationDone = false
    },
    saveAccessFailure: function(state,) {
      state.access.fetching = false
      state.access.forbidden = true
    },
    setId: function(state, id) {
      state.situation._id = id
    },
    startComputation: function(state) {
      state.calculs.updating = true
      state.calculs.exception = false
      state.calculs.error = false
    },
    setResults: function(state, results) {
      state.calculs.resultats = results
      state.calculs.updating = false
    },
    saveComputationFailure: function(state, error) {
      state.calculs.updating = false
      state.calculs.error = true
      state.calculs.exception = error.response && error.response.data || error
    },
    setMessage: function(state, message) {
      state.message = message
    },
    clearMessage: function(state) {
      state.message = null
    },
    setTitle: function(state, newTitle) {
      state.title = newTitle
    }
  },
  actions: {
    clear: function({commit}) {
      commit('clear')
      commit('initialize')
    },
    save: function(state) {
      return axios.post('/api/situations/', _.omit(state.state.situation, '_id'))
        .then(result => result.data)
        .then(payload => payload._id)
        .then(id => state.commit('setId', id))
    },
    fetch: function(state, id) {
      state.commit('fetching')
      return axios.get(`/api/situations/${id}`)
        .then(result => result.data)
        .then(payload => state.commit('reset', payload))
        .catch(() => state.commit('saveAccessFailure'))
    },
    compute: function(state, showPrivate) {
      state.commit('startComputation')
      return axios.get('api/situations/' + state.state.situation._id + '/openfisca-response')
        .then(function(OpenfiscaResponse) {
          return OpenfiscaResponse.data
        }).then(function(openfiscaResponse) {
          return computeAides(state.state.situation, openfiscaResponse, showPrivate)
        }).then(results => state.commit('setResults', results))
        .catch(error => state.commit('saveComputationFailure', error))
    },
    redirection: function(state, next) {
      state.commit('setMessage', 'Vous avez été redirigé·e sur la première page du simulateur. Vous pensez que c\'est une erreur&nbsp;? Contactez-nous&nbsp: <a href="mailto:bonjour@mes-aides.gouv.fr">bonjour@mes-aides.gouv.fr</a>.')
      next('/foyer/demandeur')
    }
  }
})
export default store

store.subscribe(({type}, { ameliNoticationDone, situation }) => {
  if (type === 'initialize') {
    return
  }
  window.sessionStorage.setItem('store', JSON.stringify({ ameliNoticationDone, situation }))
})

// Replicate strict mode
store._vm.$watch(function () { return this._data.$$state }, () => {
  if (!store._committing) {
    throw 'Do not mutate vuex store state outside mutation handlers.'
  }
}, { deep: true, sync: true })
