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
            droitsDescription.forEach(function(droit) {
                var value = result[droit.id];
                if (value) {
                    var target = { description: droit };
                    if (_.isNumber(value)) {
                        target.montant = value;
                    }
                    droits.push(target);
                }
            });

            return droits;
        },

        getDroitsNonEligibles: function(droitsEligibles) {
            var droitsNonEligibles = [];
            droitsDescription.forEach(function(droit) {
                if (!_.find(droitsEligibles, {description: {id: droit.id}})) {
                    droitsNonEligibles.push(droit);
                }
            });

            return droitsNonEligibles;
        }
    };
});
