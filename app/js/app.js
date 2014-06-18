var ddsApp = angular.module('ddsApp', ['ngRoute']);

ddsApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/s/configuration/:situationId/:entityId?/:questionName?', {
            templateUrl: '/partials/main.html',
            controller: 'mainCtrl',
            resolve: {
              situationId: function($routeParams) {
                return $routeParams.situationId;
              }
            }
        })
        .when('/s/envoi-demande/:situationId', {
            templateUrl: '/partials/envoi-demande.html',
            controller: 'envoiDemandeCtrl',
            resolve: {
                situationId: function($route) {
                    return $route.current.params.situationId;
                }
            }
        });
});
