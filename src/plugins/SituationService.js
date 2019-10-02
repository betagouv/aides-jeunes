import moment from 'moment'
import _ from 'lodash'

import { patrimoineTypes, categoriesRnc } from '../constants/resources'

var DATE_FIELDS = ['date_naissance', 'date_arret_de_travail', 'date_debut_chomage'];

/*
 * Input values may be bogus for OpenFisca.
 * Validations and amendments should not be done on 'Valider' as click may not happen (user may click back on views).
 */
function cleanSituation(situation) {
    situation.individus.forEach(function(individu) {
        var yearMoins2 = moment(situation.dateDeValeur).subtract(2, 'years').format('YYYY');
        // OpenFisca expects an integer for frais_reels and conversion is not done automatically
        var fraisReels = individu.frais_reels || {};
        if (fraisReels[yearMoins2]) {
            fraisReels[yearMoins2] = Math.round(fraisReels[yearMoins2]);
        }

        // nulls are zeroed in OpenFisca
        categoriesRnc.forEach(function(categorieRnc) {
            var ressource = individu[categorieRnc.id];
            if (ressource &&
                yearMoins2 in ressource &&
                (! _.isNumber(ressource[yearMoins2]))) {
                delete ressource[yearMoins2];
            }
        });
    });
}

function adaptPersistedIndividu(individu) {
    DATE_FIELDS.forEach(function(dateField) {
        if (individu[dateField]) {
            individu[dateField] = moment(new Date(individu[dateField]));
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
        Vue.situation = persistedSituation;
        window.sessionStorage.situation = JSON.stringify(Vue.situation)
        return adaptPersistedSituation(persistedSituation);
    }

    Vue.prototype.$situationService = {
        _cleanSituation: cleanSituation, // Exported for testing

        fetchRepresentation: function(/*situationId, representation*/) {
            return /*$http.get('api/situations/' + situationId + '/' + representation)
                .then(function(response) { return response.data; });*/
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

        restoreLocal: function() {
            if (! Vue.situation && window.sessionStorage.situation) {
                Vue.situation = JSON.parse(window.sessionStorage.situation);
            }

            if (! Vue.situation) {
                this.newSituation();
            }

            return adaptPersistedSituation(Vue.situation);
        },

        restoreRemote: function(/*situationId*/) {
            return /*$http.get('/api/situations/' + situationId, {
                params: { cacheBust: Date.now() }
            })
                .then(function(result) { return result.data; })
                .then(saveLocal);TODO*/
        },

        save: function(situation) {
            if (situation._id) {
                situation.modifiedFrom = situation._id;
            }
            cleanSituation(situation);

            return /*$http.post('/api/situations/', _.omit(situation, '_id'))
                .then(function(result) { return result.data; })
                .then(saveLocal);TODO*/
        },

        saveLocal: saveLocal,

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
            return 'TODO'//jsyaml.dump(_.omit(situation, ['__v', 'modifiedFrom', 'status', 'token', 'version']));
        },

        /**
        *@param    {String}  A situation model to send to the backend
        *@return   {String}  A boolean indicating whether the situation looks ready for OpenFisca or not
        */
        passSanityCheck: function(situation) {
            return situation.individus && situation.individus.length > 0;
        },

        getDemandeur: function(situation) {
            return _.find(situation.individus, { role: 'demandeur' });
        },

        getConjoint: function(situation) {
            return _.find(situation.individus, { role: 'conjoint' });
        },

        getEnfants: function(situation) {
            return _.filter(situation.individus, { role: 'enfant' });
        },

        getIndividusSortedParentsFirst: function(situation) {
            return [].concat(
                this.getDemandeur(situation),
                this.getConjoint(situation),
                this.getEnfants(situation)
            ).filter(function(individu) { return individu; });
        },

        hasEnfantScolarise: function(situation) {
            return _.some(situation.individus, { role: 'enfant', scolarite: 'college' }) || _.some(situation.individus, { role: 'enfant', scolarite: 'lycee' });
        },

        hasEnfant: function(situation) {
            return _.some(situation.individus, { role: 'enfant' });
        },

        setConjoint: function(situation, conjoint) {
            var individus = situation.individus;
            // si le conjoint existait déjà avant, on l'écrase
            if (this.getConjoint(situation)) {
                individus[individus.length - 1] = conjoint;
            } else {
                // on insère le conjoint en dernier dans la liste des individus
                individus.push(conjoint);
            }
        },

        setEnfants: function(situation, enfants) {
            var individus = situation.individus;
            individus = _.filter(individus, function(individu) {
                return 'enfant' !== individu.role;
            });
            individus = individus.slice(0,1)
                .concat(enfants)
                .concat(individus.slice(1));
            situation.individus = individus;
        },

        ressourcesYearMoins2Captured: function(situation) {
            var yearMoins2 = moment(situation.dateDeValeur)
                .subtract(2, 'years')
                .format('YYYY');
            var januaryYearMoins2 = moment(situation.dateDeValeur)
                .subtract(2, 'years')
                .set('month', 0)
                .format('YYYY-MM');
            var rfr = situation.foyer_fiscal && situation.foyer_fiscal.rfr && situation.foyer_fiscal.rfr[yearMoins2];
            var hasYm2Ressources = situation.individus.some(function(individu) {
                return categoriesRnc.reduce(function(hasYm2RessourcesAccum, categorieRnc) {
                    if (! individu[categorieRnc.id]) {
                        return hasYm2RessourcesAccum;
                    }

                    return hasYm2RessourcesAccum ||
                        typeof individu[categorieRnc.id][yearMoins2] == 'number' ||
                        typeof individu[categorieRnc.id][januaryYearMoins2] == 'number';
                }, false);
            });
            return typeof rfr == 'number' || hasYm2Ressources;
        },

        /* This function returns
         * - undefined if demandeur do not have any patrimoine ressource
         * - false if those ressources are all null else
         * - true
         */
        hasPatrimoine: function(situation) {
            var demandeur = situation.individus[0];
            return patrimoineTypes.reduce(function(accum, ressource) {
                if (! demandeur[ressource.id]) {
                    return accum;
                }

                return accum || _.some(_.values(demandeur[ressource.id]));

            }, undefined);
        },

        isProprietaireAvecPretEnCours(situation) {
            var isProprietaire =
                ['primo_accedant', 'proprietaire'].includes(situation.menage.statut_occupation_logement);

            return isProprietaire && situation.menage.loyer > 0;
        },

        isHebergeParticipeFrais(situation) {
            return situation.menage.statut_occupation_logement === 'loge_gratuitement'
                && situation.menage.participation_frais === true;
        },
    }
  }
}

export default SituationService
