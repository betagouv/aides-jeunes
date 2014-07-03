'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/partials/homepage.html',
            controller: 'HomepageCtrl'
        })
        .state('teaser', {
            url: '/teaser',
            templateUrl:'/partials/teaser.html'
        })
        .state('foyer', {
            url: '/configuration/foyer',
            templateUrl: '/partials/foyer.html',
            controller: 'FoyerCtrl'
        })
        .state('situations_specifiques', {
            url: '/configuration/situations-specifiques',
            templateUrl: '/partials/situations-specifiques.html',
            controller: 'SituationsSpecifiquesCtrl'
        })
        .state('capture_revenus', {
            url: '/configuration/capture-revenus',
            templateUrl: '/partials/capture-revenus.html',
            controller: 'CaptureRevenusCtrl'
        })
        .state('logement', {
            url: '/configuration/logement',
            templateUrl: '/partials/logement.html',
            controller: 'LogementCtrl'
        })
        .state('envoi_demande', {
            url: '/envoi-demande/:situationId',
            templateUrl: '/partials/envoi-demande.html',
            controller: 'EnvoiDemandeCtrl'
        });
});
