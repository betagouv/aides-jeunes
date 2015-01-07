'use strict';

var ddsApp = angular.module('acceptanceTests', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ngSanitize', 'ddsCommon']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            controller: 'IndexCtrl',
            templateUrl: '/acceptance-tests/partials/index.html',
            resolve: {
                keywords: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getKeywords();
                },
                organizations: function() {
                    return [{id: 'me', name: 'Moi'}, {id: 'cnam', name: 'CNAM'}, {id: 'pole-emploi', name: 'Pôle emploi'}, {id: 'dgcs', name: 'DGCS'}];
                },
                states: function() {
                    return [{id: 'validated', name: 'Valide'}, {id: 'pending', name: 'En attente'}, {id: 'rejected', name: 'Refusé'}];
                },
                acceptanceTests: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.get({});
                },
                activities: function(UserService, acceptanceTests) {
                    var target = acceptanceTests[0];
                    var user = UserService.user();

                    return [{
                        date: new Date('December 7, 2014 12:13:00'),
                        user: user,
                        target: target,
                        type: { label: 'Rejet', icon: 'remove'},
                        description: 'Lorem ipsum dolor sit amet, eu deserunt facilisis assentior vis, equidem appetere euripidis mel at. Duo et aliquid inermis, ubique imperdiet ne has, no vidit lorem placerat nec. Per an justo augue conceptam, ex mel facer persius. Mei cu latine senserit accommodare, ne vis augue propriae. Ei usu illud graeco fabellas.'
                    }, {
                        date: new Date('December 7, 2014 12:13:00'),
                        user: user,
                        target: target,
                        type: { label: 'Validation', icon: 'check'},
                        description: 'Lorem ipsum dolor sit amet, eu deserunt facilisis assentior vis, equidem appetere euripidis mel at. Duo et aliquid inermis, ubique imperdiet ne has, no vidit lorem placerat nec. Per an justo augue conceptam, ex mel facer persius. Mei cu latine senserit accommodare, ne vis augue propriae. Ei usu illud graeco fabellas.'
                    }, {
                        date: new Date('December 6, 2014 12:13:00'),
                        target: target,
                        type: { label: 'En succès', icon: 'thumbs-up'}
                    }, {
                        date: new Date('December 5, 2014 11:13:00'),
                        user: user,
                        target: target,
                        type: { label: 'Edition', icon: 'edit'}
                    }, {
                        date: new Date('December 4, 2014 11:30:00'),
                        target: target,
                        type: { label: 'En erreur', icon: 'thumbs-down'},
                    }, {
                        date: new Date('December 3, 2014 11:13:00'),
                        user: user,
                        target: target,
                        type: { label: 'Création', icon: 'plus'}
                    }];
                }
            }
        })
        .state('index.list', {
            url: '/?testId',
            controller: 'TestListCtrl',
            templateUrl: '/acceptance-tests/partials/test-list.html'
        })
        .state('index.timeline', {
            url: '/timeline/?testId',
            controller: 'TestTimelineCtrl',
            templateUrl: '/acceptance-tests/partials/test-timeline.html',
            resolve: {
                activities: ['AcceptanceTestsService', function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getAndHandleLastResult('');
                }]
            }
        })
        .state('index.stats', {
            url: '/stats',
            controller: 'TestListCtrl',
            templateUrl: '/acceptance-tests/partials/test-list.html'
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
