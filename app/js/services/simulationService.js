'use strict';

/* global _ */

angular.module('ddsApp').service('SimulationService', function($http, $q, droitsDescription) {
    var montantInconnu = function(droit, situation) {
        if ('aide_logement' === droit.id) {
            return _.any([
                'proprietaire' === situation.logement.type,
                'locataire' === situation.logement.type && 'foyer' === situation.logement.locationType
            ]);
        }

        return false;
    };

    return {
        simulate: function(situation) {
            var that = this;

            return $http.get('/api/situations/' + situation._id + '/simulation').then(function(result) {
                return that.createDroitsFromApiResult(result.data, situation);
            });
        },

        createDroitsFromApiResult: function(result, situation) {
            var droits = [];
            droitsDescription.forEach(function(droit) {
                if (false === droit.isSimulated) {
                    return;
                }

                var isMontantInconnu = montantInconnu(droit, situation);
                var value = result[droit.id];
                if (value || isMontantInconnu) {
                    var target = {
                        description: droit,
                        isBaseRessourcesYearMoins2: droit.isBaseRessourcesYearMoins2
                    };
                    if (isMontantInconnu) {
                        target.montant = null;
                    } else if (_.isNumber(value)) {
                        target.montant = value;
                    }
                    droits.push(target);
                }
            });

            return {
                droits: droits,
                droitsNonEligibles: this.getDroitsNonEligibles(droits)
            };
        },

        getDroitsNonEligibles: function(droitsEligibles) {
            return droitsDescription.filter(function(droit) {
                return !_.find(droitsEligibles, { description: {id: droit.id }}) && false !== droit.isSimulated;
            });
        }
    };
});
