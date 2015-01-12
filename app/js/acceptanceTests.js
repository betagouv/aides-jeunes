'use strict';

var ddsApp = angular.module('acceptanceTests', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ngSanitize', 'ddsCommon']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            abstract: true,
            controller: 'IndexCtrl',
            url: '/?testId?keyword?state?organization',
            templateUrl: '/acceptance-tests/partials/index.html',
            resolve: {
                keywords: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getKeywords();
                },
                organizations: function($http) {
                    return $http.get('/api/acceptance-tests/organizations').then(function(result) {
                        return result.data;
                    });
                },
                states: function() {
                    return [{id: 'validated', name: 'Valide'}, {id: 'pending', name: 'En attente'}, {id: 'rejected', name: 'Refusé'}];
                },
                activities: function() {
                    return [];
                }
            }
        })
        .state('index.list', {
            url: '',
            controller: 'TestListCtrl',
            templateUrl: '/acceptance-tests/partials/test-list.html',
            resolve: {
                acceptanceTests: function(AcceptanceTestsService, $stateParams) {
                    if ($stateParams.testId) {
                        return AcceptanceTestsService.getOne($stateParams.testId);
                    } else {
                        var filters = {
                            keyword: $stateParams.keyword,
                            organization: $stateParams.organization,
                            state: $stateParams.state
                        };

                        return AcceptanceTestsService.get(filters);
                    }
                }
            }
        })
        .state('index.timeline', {
            url: '/timeline',
            controller: 'TestTimelineCtrl',
            templateUrl: '/acceptance-tests/partials/test-timeline.html',
            resolve: {
                activities: ['AcceptanceTestsService', function(AcceptanceTestsService) {
                    return AcceptanceTestsService.get();
                }]
            }
        })
        .state('index.stats', {
            url: '/stats',
            controller: 'TestStatsCtrl',
            templateUrl: '/acceptance-tests/partials/test-stats.html'
        })
        .state('login', {
            url: '/login?targetUrl',
            templateUrl: '/acceptance-tests/partials/login.html',
            controller: 'LoginCtrl',
            anonymous: true
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
                },
                keywords: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getKeywords();
                }
            }
        })
        .state('edit', {
            url: '/:testId/edit',
            templateUrl: '/acceptance-tests/partials/form.html',
            controller: 'FormCtrl',
            resolve: {
                droitsObtenus: ['$http', 'test', function($http, test) {
                    return $http.get('/api/situations/' + test.situation + '/simulation').then(function(result) {
                        return result.data;
                    });
                }],
                test: ['$http', '$stateParams', function($http, $stateParams) {
                    return $http.get('/api/acceptance-tests/' + $stateParams.testId).then(function(result) {
                        return result.data;
                    });
                }],
                keywords: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getKeywords();
                }
            }
        })
        .state('users', {
            url: '/users',
            templateUrl: '/acceptance-tests/partials/users.html',
            controller: 'UsersCtrl',
            resolve: {
                users: ['$http', function($http) {
                    return $http.get('/api/users').then(function(result) {
                        return result.data;
                    });
                }],
                organizations : ['$http', function($http) {
                    return $http.get('/api/acceptance-tests/organizations').then(function(result) {
                        return result.data;
                    });
                }]
            }
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, UserService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    UserService.retrieveUserAsync()
        .catch(function() {
            $state.go('login', {targetUrl: $window.location.pathname});
        })
        .finally(function() {
            $rootScope.$on('$stateChangeStart', function(e, state) {
                if (!UserService.user() && !state.anonymous) {
                    e.preventDefault();
                    $state.go('login');
                }
            });
            $rootScope.appReady = true;
        });
});
