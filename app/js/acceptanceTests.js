'use strict';

var ddsApp = angular.module('acceptanceTests', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: '/acceptance-tests/partials/index.html',
            controller: 'IndexCtrl'
        });
});

ddsApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
