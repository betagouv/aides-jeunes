var ddsApp = angular.module('ddsApp', ['ngRoute']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/views/partials/homepage.html',
            controller: 'homepageCtrl'
        })
        .when('/configuration/:situationId/:entityId?/:questionName?', {
            templateUrl: '/views/partials/main.html',
            controller: 'mainCtrl'
        })
        .when('/envoi-demande/:situationId', {
            templateUrl: '/views/partials/envoi-demande.html',
            controller: 'envoiDemandeCtrl'
        });
});
