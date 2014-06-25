'use strict';

angular.module('ddsBackend').factory('TaskService', function($http) {
    return {
        labels: {
            'nir_validation': 'Validation du code NIR',
            'revenus_dgfip': 'Vérification des revenus'
        },

        find: function(taskId) {
            return $http.get('/api/tasks/' + taskId).then(function(result) {
                return result.data;
            });
        }
    };
});
