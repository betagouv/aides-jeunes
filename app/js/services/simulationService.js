'use strict';

/* global _ */

angular.module('ddsApp').service('SimulationService', function($http, $q, droitsDescription) {
    return {
        simulate: function(situation) {
            var that = this;

            return $http.get('/api/situations/' + situation._id + '/simulation').then(function(result) {
                return that.createDroitsFromApiResult(result.data);
            });
        },

        createDroitsFromApiResult: function(result) {
            var droits = [];
            var droitsYearMoins2 = [];
            droitsDescription.forEach(function(droit) {
                if (false === droit.isSimulated) {
                    return;
                }
                var value = result[droit.id];
                if (value) {
                    var target = { description: droit };
                    if (_.isNumber(value)) {
                        target.montant = value;
                    }
                    if (droit.isBaseRessourcesYearMoins2) {
                        droitsYearMoins2.push(target);
                    } else {
                        droits.push(target);
                    }
                }
            });

            return {
                droits: droits,
                droitsYearMoins2: droitsYearMoins2,
                droitsNonEligibles: this.getDroitsNonEligibles(droits.concat(droitsYearMoins2))
            };
        },

        getDroitsNonEligibles: function(droitsEligibles) {
            return droitsDescription.filter(function(droit) {
                return !_.find(droitsEligibles, { description: {id: droit.id }}) && false !== droit.isSimulated;
            });
        }
    };
});
