'use strict';

var ddsApp = angular.module('ddsBackend', ['ngRoute']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/back/partials/taskList.html',
            controller: 'TaskListCtrl'
        })
        .when('/login', {
            templateUrl: '/back/partials/login.html',
            controller: 'LoginCtrl'
        });
});

ddsApp.run(function($rootScope, $location, UserService) {
    var routeChangeLoginListener = function() {
        var isRouteLogin = ('/login' === $location.path());
        if (!UserService.isLoggedIn() && !isRouteLogin) {
            $location.path('/login');
        } else if (isRouteLogin && UserService.isLoggedIn()) {
            $location.path('/');
        }
    };

    $rootScope.$on('$routeChangeStart', routeChangeLoginListener);
    routeChangeLoginListener();
});
