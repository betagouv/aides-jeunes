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
        },

        validate: function(task) {
            return this.changeTaskStatus(task, 'ok');
        },

        invalidate: function(task) {
            return this.changeTaskStatus(task, 'ko');
        },

        changeTaskStatus: function(task, status) {
            return $http.post('/api/tasks/' + task._id + '/change-status', {status: status});
        }
    };
});
