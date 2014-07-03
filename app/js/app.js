'use strict';

var ddsApp = angular.module('ddsApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngStorage']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/homepage.html',
            controller: 'HomepageCtrl'
        })
        .when('/teaser', {
            templateUrl: '/partials/teaser.html'
        })
        .when('/configuration/foyer', {
            templateUrl: '/partials/foyer.html',
            controller: 'FoyerCtrl'
        })
        .when('/configuration/situations-specifiques', {
            templateUrl: '/partials/situations-specifiques.html',
            controller: 'SituationsSpecifiquesCtrl'
        })
        .when('/configuration/capture-revenus', {
            templateUrl: '/partials/capture-revenus.html',
            controller: 'CaptureRevenusCtrl'
        })
        .when('/configuration/revenus-aides', {
            templateUrl: '/partials/revenus-aides.html',
            controller: 'RevenusAidesCtrl'
        })
        .when('/configuration/logement', {
            templateUrl: '/partials/logement.html',
            controller: 'LogementCtrl'
        })
        .when('/envoi-demande/:situationId', {
            templateUrl: '/partials/envoi-demande.html',
            controller: 'EnvoiDemandeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
