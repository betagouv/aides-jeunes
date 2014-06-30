'use strict';

angular.module('ddsApp').factory('SituationService', function($http) {
    return {
        find: function(situationId) {
            return $http.get('/api/situations/' + situationId).then(function(result) {
                return result.data;
            });
        },

        update: function(situationId, data) {
            return $http.put('/api/situations/' + situationId, data);
        }
    };
});
