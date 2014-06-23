'use strict';

var ddsApp = angular.module('ddsApp', ['ngRoute']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/homepage.html',
            controller: 'HomepageCtrl'
        })
        .when('/configuration/:situationId/:entityId?/:questionName?', {
            templateUrl: '/partials/main.html',
            controller: 'MainCtrl'
        })
        .when('/envoi-demande/:situationId', {
            templateUrl: '/partials/envoi-demande.html',
            controller: 'EnvoiDemandeCtrl'
        });
});
