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
                    var toInsert = { description: droit };
                    if (_.isNumber(value)) {
                        toInsert.montant = value;
                    }
                    droits.push(toInsert);
                }
            });

            return droits;
        }
    };
});
