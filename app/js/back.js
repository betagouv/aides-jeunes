'use strict';

var ddsApp = angular.module('ddsBackend', ['ngRoute']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/back/partials/taskList.html',
            controller: 'TaskListCtrl'
        });
});
