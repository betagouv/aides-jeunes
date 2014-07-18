'use strict';

var ddsApp = angular.module('acceptanceTests', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: '/acceptance-tests/partials/index.html',
            controller: 'IndexCtrl'
        })
        .state('index.new', {
            url: '/new/:situationId',
            onEnter: ['$state', '$modal', function($state, $modal) {
                $modal.open({
                    templateUrl: '/acceptance-tests/partials/new.html',
                    controller: 'FoyerSituationsSpecifiquesModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function() {
                    return $state.go('foyer');
                });
            }]
        });
});

ddsApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
