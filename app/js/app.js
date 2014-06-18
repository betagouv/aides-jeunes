var ddsApp = angular.module('ddsApp', ['ngRoute']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/homepage.html',
            controller: 'homepageCtrl'
        })
        .when('/s/configuration/:situationId/:entityId?/:questionName?', {
            templateUrl: '/partials/main.html',
            controller: 'mainCtrl'
        })
        .when('/s/envoi-demande/:situationId', {
            templateUrl: '/partials/envoi-demande.html',
            controller: 'envoiDemandeCtrl'
        });
});
