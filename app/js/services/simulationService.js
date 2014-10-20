'use strict';

/* global _ */

angular.module('ddsApp').factory('SimulationService', function($http, $q, droitsDescription) {
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
                        if ('acs' === droit.id) {
                            target.montant = 12 * value;
                        } else {
                            target.montant = value;
                        }
                    }
                    droits.push(target);
                }
            });

            return droits;
        }
    };
});
