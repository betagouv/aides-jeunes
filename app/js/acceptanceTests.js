'use strict';

var ddsApp = angular.module('acceptanceTests', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ngSanitize']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: '/acceptance-tests/partials/index.html',
            controller: 'IndexCtrl',
            resolve: {
                acceptanceTests: ['$http', function($http) {
                    return $http.get('/api/acceptance-tests').then(function(result) {
                        return result.data;
                    });
                }],
                droits: ['$http', function($http) {
                    return $http.get('/resources/droits.json').then(function(result) {
                        return result.data;
                    });
                }]
            }
        })
        .state('new', {
            url: '/new/:situationId',
            templateUrl: '/acceptance-tests/partials/form.html',
            controller: 'FormCtrl',
            resolve: {
                droitsObtenus: ['$http', '$stateParams', function($http, $stateParams) {
                    return $http.get('/api/situations/' + $stateParams.situationId + '/simulation').then(function(result) {
                        return result.data;
                    });
                }],
                test: function() {
                    return null;
                }
            }
        })
        .state('edit', {
            url: '/:testId/edit',
            templateUrl: '/acceptance-tests/partials/form.html',
            controller: 'FormCtrl',
            resolve: {
                droitsObtenus: function() {
                    return null;
                },
                test: ['$http', '$stateParams', function($http, $stateParams) {
                    return $http.get('/api/acceptance-tests/' + $stateParams.testId).then(function(result) {
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
