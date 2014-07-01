'use strict';

var ddsApp = angular.module('ddsApp', ['ngRoute', 'ui.bootstrap', 'ngStorage']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/homepage.html',
            controller: 'HomepageCtrl'
        })
        .when('/configuration/date-naissance', {
            templateUrl: '/partials/birth-date.html',
            controller: 'BirthDateCtrl'
        })
        .when('/configuration/foyer', {
            templateUrl: '/partials/foyer.html',
            controller: 'FoyerCtrl'
        })
        .when('/configuration/situations-specifiques', {
            templateUrl: '/partials/situations-specifiques.html',
            controller: 'SituationsSpecifiquesCtrl'
        })
        .when('/configuration/revenus-aides/selection-personnes', {
            templateUrl: '/partials/selection-personnes-revenus.html',
            controller: 'SelectionPersonnesRevenusCtrl'
        })
        .when('/configuration/revenus-aides', {
            templateUrl: '/partials/revenus-aides.html',
            controller: 'RevenusAidesCtrl'
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
