import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

import { computeAides, datesGenerator } from '../backend/lib/mes-aides'
import { categoriesRnc, patrimoineTypes } from './constants/resources'
import Institution from './lib/Institution'

let DATE_FIELDS = ['date_naissance', 'date_arret_de_travail', 'date_debut_chomage']

function adaptPersistedIndividu(individu) {
    DATE_FIELDS.forEach(function(dateField) {
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
    message: null,
    situation: {
      _id: null,
      external_id: null,
      dateDeValeur: now,
      enfants: [],
      famille: {},
      foyer_fiscal: {},
      menage: {
        aide_logement_date_pret_conventionne: '2017-12-31'
      },
      version: 15,
    },
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
    iframeOrigin: null
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
    calculs: store.calculs || defaultCalculs(),
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
      ).filter((individu) => individu)
    },
    getIndividu: function(state, getters) {
      return (id) => {
        let items = getters.peopleParentsFirst.filter(i => i.id == id)
        return items.length ? items[0] : null
      }
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
    isProprietaireAvecPretEnCours: function(state) {
      let menage = state.situation.menage
      let isProprietaire = ['primo_accedant', 'proprietaire'].includes(menage.statut_occupation_logement)
      return isProprietaire && menage.loyer > 0
    },
    isHebergeParticipeFrais: function(state) {
      let menage = state.situation.menage
      return menage.statut_occupation_logement === 'loge_gratuitement' && menage.participation_frais === true
    },
    /* This function returns
     * - undefined if demandeur do not have any patrimoine ressource
     * - false if those ressources are all null else
     * - true
     */
    hasPatrimoine: function(state) {
        let demandeur = state.situation.demandeur
        return patrimoineTypes.reduce(function(accum, ressource) {
            if (! demandeur[ressource.id]) {
                return accum
            }

            return accum || _.some(_.values(demandeur[ressource.id]))

        }, undefined)
    },
    fetchRepresentation: function(state) {
      return function(representation, situationId) {
        return axios.get(`api/situations/${situationId || state.situation._id}/${representation}`)
          .then((response) => response.data)
      }
    },
    hasResults: function(state) {
      return state.situation._id && state.calculs.resultats._id && state.calculs.resultats._id === state.situation._id
    }
  },
  mutations: {
    clear: function(state) {
      state.situation = {}
      state.access.forbidden = false
      state.access.fetching = false
    },
    initialize: function(state) {
      const { situation, dates, ameliNoticationDone, calculs } = restoreLocal()
      state.situation = situation
      state.calculs = calculs
      state.dates = dates
      state.ameliNoticationDone = ameliNoticationDone
    },
    saveFamille: function(state, famille) {
      state.situation = Object.assign({}, state.situation, { famille })
    },
    saveFoyerFiscal: function(state, foyer_fiscal) {
      state.situation = Object.assign({}, state.situation, { foyer_fiscal })
    },
    saveMenage: function(state, menage) {
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
    saveIndividu: function(state, individu) {
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
      state.calculs.dirty = false
    },
    saveAccessFailure: function(state,) {
      state.access.fetching = false
      state.access.forbidden = true
    },
    setId: function(state, id) {
      state.situation._id = id
      state.calculs.dirty = false
    },
    setExternalId: function(state, id) {
      state.situation.external_id = id
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
    },
    setDirty: function(state) {
      state.calculs.dirty = true
    },
    setThemeColor: function(state, themeColor) {
      state.themeColor = themeColor
    },
    setIframeOrigin: function(state, newOrigin) {
      state.inIframe = true
      state.iframeOrigin = newOrigin
    },
  },
  actions: {
    clear: function({commit}, external_id) {
      commit('clear')
      commit('initialize')
      commit('setExternalId', external_id)
    },
    initialize: function({ commit }) {
      commit('initialize')
    },
    removeConjoint: function({ commit }) {
      commit('removeConjoint')
      commit('setDirty')
    },
    removeEnfant: function({ commit }, id) {
      commit('removeEnfant', id)
      commit('setDirty')
    },
    addEnfant: function({ commit }, enfant) {
      commit('addEnfant', enfant)
      commit('setDirty')
    },
    updateIndividu: function({ commit }, individu) {
      commit('saveIndividu', individu)
      commit('setDirty')
    },
    updateFamille: function({ commit }, famille) {
      commit('saveFamille', famille)
      commit('setDirty')
    },
    updateFoyerFiscal: function({ commit }, foyer_fiscal) {
      commit('saveFoyerFiscal', foyer_fiscal)
      commit('setDirty')
    },
    updateMenage: function({ commit }, menage) {
      commit('saveMenage', menage)
      commit('setDirty')
    },
    save: function(state) {
      let situation = _.omit(state.state.situation, '_id')
      if (state.state.situation._id) {
          situation.modifiedFrom = state.state.situation._id
      }

      return axios.post('/api/situations/', situation)
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
          return computeAides.bind(Institution)(state.state.situation, openfiscaResponse, showPrivate)
        }).then(results => {
          const hasRsa = _.some(results.droitsEligibles, i => i.id === 'rsa') || _.some(results.droitsInjectes, i => i.id === 'rsa' && i.montant)
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
                top: 0
              })
            })
          }

          return results
        })
        .then(results => state.commit('setResults', results))
        .catch(error => state.commit('saveComputationFailure', error))
    },
    redirection: function(state, next) {
      state.commit('setMessage', 'Vous avez été redirigé·e sur la première page du simulateur. Vous pensez que c\'est une erreur&nbsp;? Contactez-nous&nbsp: <a href="mailto:equipe@mes-aides.org">equipe@mes-aides.org</a>.')
      next('/foyer/demandeur')
    },
    verifyBenefitVariables: function(state) {
      return axios.get('api/openfisca/variables')
        .then(response => response.data)
        .then(variableNames => {
          let warnUser = false
          Institution.forEachBenefit((benefit, benefitId) => {
            warnUser = warnUser || (!benefit.test && variableNames.indexOf(benefitId) <= 0)
          })

          if (warnUser) {
            state.commit('setMessage', '🚀 Vous avez ajouté une nouvelle aide&nbsp;!<br/>Étant donné que nous ne savons pas encore comment celle-ci doit être calculée, si vous faites votre simulation jusqu’au bout vous obtiendrez un message d’erreur.')
          }
        })
    }
  }
})
export default store

store.subscribe(({type}, { ameliNoticationDone, situation, calculs }) => {
  if (type === 'initialize') {
    return
  }
  window.sessionStorage.setItem('store', JSON.stringify({ ameliNoticationDone, situation, calculs }))
})

// Replicate strict mode
store._vm.$watch(function () { return this._data.$$state }, () => {
  if (!store._committing) {
    throw 'Do not mutate vuex store state outside mutation handlers.'
  }
}, { deep: true, sync: true })
