'use strict';

var ddsApp = angular.module('ddsApp', ['ngRoute']);

ddsApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/homepage.html',
            controller: 'homepageCtrl'
        })
        .when('/configuration/:situationId/:entityId?/:questionName?', {
            templateUrl: '/partials/main.html',
            controller: 'mainCtrl'
        })
        .when('/envoi-demande/:situationId', {
            templateUrl: '/partials/envoi-demande.html',
            controller: 'envoiDemandeCtrl'
        });
}]);
