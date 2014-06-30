'use strict';

angular.module('ddsApp').factory('SimulationService', function($http) {
    return {
        simulate: function(situationId) {
            $http.get('/api/situations/' + situationId + '/simulation').then(function(result) {
                var returnedAides = [];
                _.forEach(result.data, function(value, aide) {
                    if (!(aide in aides)) return;
                    var obj = { partial: aides[aide].partial };
                    if (aides[aide].type === Number && value > 0) {
                        obj.montant = value;
                        returnedAides.push(obj);
                    }
                    if (aides[aide].type === Boolean && value === true) {
                        returnedAides.push(obj);
                    }
                });

                return returnedAides;
            });
        }
    };
});
