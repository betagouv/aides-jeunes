'use strict';

angular.module('ddsApp').factory('SimulationService', function($http, $q) {
    return {
        simulate: function(situation) {
            var deferred = $q.defer();
            var that = this;

            $http.get('/resources/droits.json').then(function(res) {
                $http.get('/api/situations/' + situation._id + '/simulation').then(function(droits) {
                    deferred.resolve(that.createDroitsFromApiResult(droits.data, res.data));
                }, function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        },

        createDroitsFromApiResult: function(result, droitsList) {
            var droits = [];
            droitsList.forEach(function(droit) {
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
