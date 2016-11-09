'use strict';

var DATE_FIELDS = ['dateDeNaissance', 'dateArretDeTravail', 'dateDernierContratTravail'];

angular.module('ddsCommon').factory('SituationService', function($http, $sessionStorage, categoriesRnc, ImpactStudyService) {
    var situation;

    var flattenRessource = function(ressource, source, target) {
        if (ressource.periode) {
            target.push(ressource);
            return;
        }

        var debutPeriode = moment(ressource.debutPeriode, 'YYYY-MM');
        var finPeriode = moment(ressource.finPeriode, 'YYYY-MM');
        var monthsDiff = finPeriode.diff(debutPeriode, 'months') + 1;
        var totalMontantToFlatten = ressource.montant;
        _.where(source, {type: ressource.type}).forEach(function(diffRessource) {
            var periode = diffRessource.periode;
            if (periode) {
                periode = moment(periode, 'YYYY-MM');
                if ((periode.isAfter(debutPeriode) || periode.isSame(debutPeriode)) &&
                    (periode.isBefore(finPeriode) || periode.isSame(finPeriode))) {
                    totalMontantToFlatten -= diffRessource.montant;
                    monthsDiff--;
                }
            }
        });

        var flattenedMontant = Math.round(totalMontantToFlatten / monthsDiff * 100) / 100;

        while (debutPeriode.isBefore(finPeriode) || debutPeriode.isSame(finPeriode)) {
            if (! _.find(source, {periode: debutPeriode.format('YYYY-MM')})) {
                var splittedRessource = {
                    periode: debutPeriode.format('YYYY-MM'),
                    montant: flattenedMontant
                };
                if (ressource.type) {
                    splittedRessource.type = ressource.type;
                }
                target.push(splittedRessource);
            }
            debutPeriode.add(1, 'months');
        }
    };

    function convertDatesToMoments(individu) {
        DATE_FIELDS.forEach(function(dateField) {
            if (individu[dateField]) {
                individu[dateField] = moment(individu[dateField]);
            }
        });
    }

    return {
        newSituation: function() {
            situation = $sessionStorage.situation = { individus: [], dateDeValeur: moment().format() };
            ImpactStudyService.resetSessionId();
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

        restoreRemote: function(situationId) {
            return $http.get('/api/situations/' + situationId, {
                params: { cacheBust: Date.now() }
            }).then(function(result) {
                situation = result.data;

                situation.individus.forEach(convertDatesToMoments);

                $sessionStorage.situation = situation;

                return situation;
            });
        },

        getMonths: function(baseDate) {
            var refDate = baseDate ? moment(baseDate) : moment();
            refDate.subtract(4, 'months');
            return _.map([3, 2, 1], function() {
                refDate.add(1, 'months');
                return {
                    id: refDate.format('YYYY-MM'),
                    label: refDate.format('MMMM YYYY')
                };
            });
        },

        save: function(situation) {
            return $http({
                    method: situation._id ? 'put' : 'post',
                    url: '/api/situations/' + (situation._id || ''),
                    data: this.createApiCompatibleSituation(situation)
                }).then(function(result) {
                    situation._id = result.data._id;
                    return result.data;
                });
        },

        createApiCompatibleSituation: function(situation) {
            var individus = _.map(situation.individus, this.createApiCompatibleIndividu);

            var conjoint = _.find(individus, { role: 'conjoint' });
            var demandeur = _.find(individus, { role: 'demandeur' });
            if (conjoint) {
                demandeur.statutMarital = conjoint.statutMarital;
            } else {
                demandeur.statutMarital = demandeur.situationFamiliale;
            }

            var result = {
                individus: individus,
                logement: situation.logement,
                patrimoine: situation.patrimoine,
                rfr: situation.rfr,
                ressourcesYearMoins2Captured: this.ressourcesYearMoins2Captured(situation)
            };


            return result;
        },

        createApiCompatibleIndividu: function(individu) {
            var result = _.cloneDeep(individu);
            DATE_FIELDS.forEach(function (dateField) {
                result[dateField] = individu[dateField] && individu[dateField].format('YYYY-MM-DD');
            });

            return result;
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
            return situation.rfr === 0 || situation.rfr || situation.individus.some(function(individu) {
                    return individu.ressources && individu.ressources.some(function(ressource) {
                        return _.pluck(categoriesRnc, 'id').indexOf(ressource.type) >= 0;
                    });
                });
        }
    };
});
