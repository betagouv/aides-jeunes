'use strict';

var ddsApp = angular.module('ddsApp', ['ngRoute']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/homepage.html',
            controller: 'HomepageCtrl'
        })
        .when('/configuration/foyer', {
            templateUrl: '/partials/foyer.html',
            controller: 'FoyerCtrl'
        })
        .when('/configuration/:situationId/:entityId?/:questionName?', {
            templateUrl: '/partials/main.html',
            controller: 'MainCtrl',
            resolve: {
                situationData: function($route, SituationService) {
                    return SituationService.find($route.current.params.situationId);
                }
            }
        })
        .when('/envoi-demande/:situationId', {
            templateUrl: '/partials/envoi-demande.html',
            controller: 'EnvoiDemandeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
