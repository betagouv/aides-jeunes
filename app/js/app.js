var ddsApp = angular.module('ddsApp', ['ngRoute']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/s/:situationId/:entityId?/:questionName?', {
            templateUrl: '/partials/main.html',
            controller: 'mainCtrl'
        });
});
