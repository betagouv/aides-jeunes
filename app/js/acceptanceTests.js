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
        .state('new', {
            url: '/new/:situationId',
            templateUrl: '/acceptance-tests/partials/form.html',
            controller: 'FormCtrl',
            resolve: {
                situation: ['$http', '$stateParams', function($http, $stateParams) {
                    return $http.get('/api/situations/' + $stateParams.situationId).then(function(result) {
                        return result.data;
                    });
                }],
                droits: ['$http', '$stateParams', function($http, $stateParams) {
                    return $http.get('/api/situations/' + $stateParams.situationId + '/simulation').then(function(result) {
                        return result.data;
                    });
                }]
            }
        });
});

ddsApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
