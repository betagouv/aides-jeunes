'use strict';

angular.module('ddsBackend').controller('TaskCtrl', function($scope, TaskService, task) {
    $scope.task = task;
    $scope.taskLabels = TaskService.labels;
    $scope.validate = function() {
        TaskService.validate(task);
    };
    $scope.invalidate = function() {
        TaskService.invalidate(task);
    };
});
