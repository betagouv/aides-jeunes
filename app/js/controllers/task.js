'use strict';

angular.module('ddsBackend').controller('TaskCtrl', function($scope, TaskService, task) {
    $scope.task = task;
    $scope.taskLabels = TaskService.labels;
    $scope.statusLabels = TaskService.statusLabels;

    $scope.validate = function() {
        TaskService.validate(task).success(function(_task) {
            $scope.task = task = _task;
        });
    };

    $scope.invalidate = function() {
        TaskService.invalidate(task).success(function(_task) {
            $scope.task = task = _task;
        });
    };

    $scope.isTaskEditable = function() {
        return task.status !== 'ko' && task.status !== 'ok';
    };
});
