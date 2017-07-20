'use strict';

var DATE_FIELDS = ['dateDeNaissance', 'dateArretDeTravail', 'dateDernierContratTravail'];

angular.module('ddsCommon').factory('SituationService', function($http, $sessionStorage, categoriesRnc) {
    var situation;

    function convertDatesToMoments(individu) {
        DATE_FIELDS.forEach(function(dateField) {
            if (individu[dateField]) {
                individu[dateField] = moment(individu[dateField]);
            }
        });
    }

    return {
        newSituation: function() {
            situation = $sessionStorage.situation = {
                individus: [],
                dateDeValeur: moment().format(),
                famille: {},
                foyer_fiscal: {},
                menage: {},
            };
        },

        restoreLocal: function() {
            if (! situation) {
                situation = $sessionStorage.situation;
            }

            if (! situation) {
                this.newSituation();
            }

            situation.individus.forEach(convertDatesToMoments);

            return situation;
        },

        getMonths: function(baseDate, count, upTo) {
            if (! count) {
                count = 3;
            }
            if (! upTo) {
                upTo = 0;
            }
            var refDate = baseDate ? moment(baseDate) : moment();
            refDate.subtract(count + upTo + 1, 'months');
            return _.map(_.range(count + upTo, upTo, -1), function() {
                refDate.add(1, 'months');
                return {
                    id: refDate.format('YYYY-MM'),
                    label: refDate.format('MMMM YYYY')
                };
            });
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
            var yearMoins2 = moment(situation.dateDeValeur).subtract('years', 2).format('YYYY');
            var rfr = situation.foyer_fiscal.rfr && situation.foyer_fiscal.rfr[yearMoins2];
            var hasYm2Ressources = situation.individus.some(function(individu) {
                return individu.ressources && individu.ressources.some(function(ressource) {
                    return _.map(categoriesRnc, 'id').indexOf(ressource.type) >= 0;
                });
            });
            return rfr || rfr === 0 || hasYm2Ressources;
        }
    };
});
