import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

import { computeAides, datesGenerator } from '../backend/lib/mes-aides'

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
    situation: {
      _id: null,
      dateDeValeur: now,
      enfants: [],
      famille: {},
      foyer_fiscal: {},
      menage: {
        aide_logement_date_pret_conventionne: '2017-12-31'
      },
      version: 12,
    },
    calculs: {
      resultats: {
        droitsEligibles: [],
        droitsNonEligibles: [],
        droitsInjectes: [],
      },
      error: false,
      exception: false,
      updating: true,
    },
    dates: datesGenerator(now)
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
    dates: datesGenerator(store.situation.dateDeValeur)
  }
}

const store = new Vuex.Store({
  state: defaultStore(),
  strict: true,
  mutations: {
    clear: function(state) {
      state.situation = {}
    },
    initialize: function(state) {
      const { situation, dates } = restoreLocal()
      state.situation = situation
      state.dates = dates
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
      state.calculs.error = true
      state.calculs.exception = error.response && error.response.data || error
    },
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
    compute: function(state, showPrivate) {
      state.commit('startComputation')
      return axios.get('api/situations/' + state.state.situation._id + '/openfisca-response')
        .then(function(OpenfiscaResponse) {
          return OpenfiscaResponse.data
        }).then(function(openfiscaResponse) {
          return computeAides(state.state.situation, openfiscaResponse, showPrivate)
        }).then(results => state.commit('setResults', results))
        .catch(error => state.commit('saveComputationFailure', error))
    }
  }
})
export default store

store.subscribe(({type}, { situation }) => {
  if (type === 'initialize') {
    return
  }
  window.sessionStorage.setItem('store', JSON.stringify({ situation }))
})
