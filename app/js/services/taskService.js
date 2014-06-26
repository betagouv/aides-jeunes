'use strict';

angular.module('ddsBackend').factory('TaskService', function($http) {
    return {
        labels: {
            'nir_validation': 'Validation du code NIR',
            'revenus_dgfip': 'Vérification des revenus'
        },

        statusLabels: {
            todo: 'À traiter',
            pending: 'En cours de traitement',
            ok: 'Validé',
            ko: 'Invalidé'
        },

        find: function(taskId) {
            return $http.get('/api/tasks/' + taskId).then(function(result) {
                return result.data;
            });
        },

        validate: function(task) {
            return this.changeTaskStatus(task, 'ok');
        },

        invalidate: function(task, invalidationMessage) {
            return this.changeTaskStatus(task, 'ko', invalidationMessage);
        },

        changeTaskStatus: function(task, status, invalidationMessage) {
            var data = {status: status};
            if (angular.isString(invalidationMessage)) {
                data.invalidationMessage = invalidationMessage;
            }

            return $http.post('/api/tasks/' + task._id + '/change-status', data);
        }
    };
});
