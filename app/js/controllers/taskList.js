'use strict';

angular.module('ddsBackend').controller('TaskListCtrl', function($scope, $http) {
    $scope.situationsNb = 2;
    $scope.taskLabels = {
        'nir_validation': 'Validation du code NIR',
        'revenus_dgfip': 'Vérification des revenus'
    };

    $http.get('/api/situations').then(function(result) {
        var situations = {};
        for (var i in result.data) {
            var task = result.data[i];
            var situation = task.situation;
            if (!situations[situation._id]) {
                situations[situation._id] = situation;
                situations[situation._id].tasks = [];
            }
            situations[situation._id].tasks.push(task);
        }

        $scope.situations = [];
        for (var j in situations) {
            $scope.situations.push(situations[j]);
        }
    });
});
