import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

import { computeAides, datesGenerator } from '../../backend/lib/mes-aides'
import { categoriesRnc } from '../constants/resources'

var DATE_FIELDS = ['date_naissance', 'date_arret_de_travail', 'date_debut_chomage'];

/*
 * Input values may be bogus for OpenFisca.
 * Validations and amendments should not be done on 'Valider' as click may not happen (user may click back on views).
 */
function cleanSituation(situation) {
    situation.individus.forEach(function(individu) {
        var yearMinusTwo = moment(situation.dateDeValeur).subtract(2, 'years').format('YYYY');
        // OpenFisca expects an integer for frais_reels and conversion is not done automatically
        var fraisReels = individu.frais_reels || {};
        if (fraisReels[yearMinusTwo]) {
            fraisReels[yearMinusTwo] = Math.round(fraisReels[yearMinusTwo]);
        }

        // nulls are zeroed in OpenFisca
        categoriesRnc.forEach(function(categorieRnc) {
            var ressource = individu[categorieRnc.id];
            if (ressource &&
                yearMinusTwo in ressource &&
                (! _.isNumber(ressource[yearMinusTwo]))) {
                delete ressource[yearMinusTwo];
            }
        });
    });
}

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
    if (situation.individus) {
        situation.individus.forEach(adaptPersistedIndividu);
    }
    return situation;
}

const SituationService = {
  install (Vue) {
    Vue.situation = null

    function saveLocal(persistedSituation) {
        persistedSituation = persistedSituation || Vue.situation

        window.sessionStorage.situation = JSON.stringify(persistedSituation)
        Vue.situation = adaptPersistedSituation(persistedSituation)
        return Vue.situation
    }

    Vue.prototype.$SituationService = {
        _cleanSituation: cleanSituation, // Exported for testing

        YAMLRepresentation: function(sourceSituation) {
            var situation = _.cloneDeep(sourceSituation);
            situation.dateDeValeur = moment(new Date(situation.dateDeValeur)).format('YYYY-MM-DD');
            situation.individus.forEach(function(individu) {
                DATE_FIELDS.forEach(function(dateField) {
                    if (individu[dateField]) {
                        individu[dateField] = individu[dateField].format('YYYY-MM-DD');
                    }
                });

                delete individu.hasRessources;
            });
            return 'TODO4'//jsyaml.dump(_.omit(situation, ['__v', 'modifiedFrom', 'status', 'token', 'version']));
        },

        fetchRepresentation: function(/*situationId, representation*/) {
            return /*$http.get('api/situations/' + situationId + '/' + representation)
                .then(function(response) { return response.data; });*/
        },

        fetchResults: function(showPrivate) {
            return axios.get('api/situations/' + Vue.situation._id + '/openfisca-response')
                .then(function(OpenfiscaResponse) {
                    return OpenfiscaResponse.data;
                }).then(function(openfiscaResponse) {
                    return computeAides(Vue.situation, openfiscaResponse, showPrivate);
                });
        },

        newSituation: function() {
            saveLocal({
                individus: [],
                dateDeValeur: moment().format(),
                famille: {},
                foyer_fiscal: {},
                menage: {
                    aide_logement_date_pret_conventionne: '2017-12-31'
                },
                version: 11,
            })
        },

        clear: function() {
            Vue.situation = null
            delete window.sessionStorage.situation
        },

        restoreLocal: function() {
            if (! Vue.situation && window.sessionStorage.situation) {
                Vue.situation = JSON.parse(window.sessionStorage.situation);
            }

            if (! Vue.situation) {
                this.newSituation();
            }

            Vue.prototype.dates = datesGenerator(Vue.situation.dateDeValeur)

            return adaptPersistedSituation(Vue.situation);
        },

        restoreRemote: function(/*situationId*/) {
            return /*$http.get('/api/situations/' + situationId, {
                params: { cacheBust: Date.now() }
            })
                .then(function(result) { return result.data; })
                .then(saveLocal);TODO2*/
        },

        save: function() {
            if (Vue.situation._id) {
                Vue.situation.modifiedFrom = Vue.situation._id;
            }
            cleanSituation(Vue.situation);

            return axios.post('/api/situations/', _.omit(Vue.situation, '_id'))
                .then(function(result) { return result.data; })
                .then(saveLocal);
        },

        saveLocal: saveLocal,

    }
  }
}

export default SituationService
