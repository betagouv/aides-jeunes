'use strict';

angular.module('ddsBackend').controller('TaskListCtrl', function($scope, $http, TaskService) {
    $scope.situationsNb = 0;
    $scope.taskLabels = TaskService.labels;

    $scope.taskAuthorities = {
        'nir_validation': 'CNAM',
        'revenus_dgfip': 'DGFIP'
    };

    $scope.statusLabels = {
        todo: 'À traiter',
        pending: 'En cours de traitement',
        ok: 'Validé',
        ko: 'Invalidé'
    };

    $http.get('/api/tasks').then(function(result) {
        var situations = {};
        for (var i in result.data) {
            var task = result.data[i];
            var situationId = task.situation._id;
            var situation = situations[situationId];
            if (!situation) {
                situations[situationId] = situation = task.situation;
                situation.tasks = [];
            }
            situation.tasks.push(task);
        }

        $scope.situations = [];
        for (var j in situations) {
            $scope.situations.push(situations[j]);
        }
        $scope.situationsNb = $scope.situations.length;
    });
});
