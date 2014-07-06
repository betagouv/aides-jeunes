'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/partials/homepage.html',
            controller: 'HomepageCtrl'
        })
        .state('teaser', {
            url: '/teaser',
            templateUrl:'/partials/teaser.html'
        })
        .state('foyer', {
            url: '/configuration/foyer',
            views: {
                '': {
                    templateUrl: '/partials/foyer.html',
                    controller: 'FoyerCtrl'
                },
                'demandeur@foyer': {
                    templateUrl: '/partials/foyer/demandeur.html',
                    controller: 'FoyerDemandeurCtrl'
                },
                'conjoint@foyer': {
                    templateUrl: '/partials/foyer/conjoint.html',
                    controller: 'FoyerConjointCtrl'
                },
                'enfants@foyer': {
                    templateUrl: '/partials/foyer/enfants.html',
                    controller: 'FoyerEnfantsCtrl'
                },
                'personnesACharge@foyer': {
                    templateUrl: '/partials/foyer/personnes-a-charge.html',
                    controller: 'FoyerPersonnesAChargeCtrl'
                },
            }
        })
        .state('foyer.demandeur_modal', {
            url: '/demandeur',
            onEnter: function($state, $modal, SituationService) {
                $modal.open({
                    templateUrl: '/partials/foyer/conjoint-modal.html',
                    controller: 'ConjointModalCtrl',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        individuType: function() {
                            return 'demandeur';
                        }
                    }
                }).result.then(function(demandeur) {
                    SituationService.saveLocal({demandeur: demandeur});
                    return $state.go("foyer");
                });
            }
        })
        .state('foyer.conjoint_modal', {
            url: '/conjoint',
            onEnter: function($state, $modal, SituationService) {
                $modal.open({
                    templateUrl: '/partials/foyer/conjoint-modal.html',
                    controller: 'ConjointModalCtrl',
                    resolve: {
                        individuType: function() {
                            return 'conjoint';
                        }
                    }
                }).result.then(function(conjoint) {
                    var situation = SituationService.restoreLocal();
                    situation.conjoint = conjoint;
                    SituationService.saveLocal(situation);

                    return $state.go("foyer");
                });
            }
        })
        .state('foyer.enfant_modal', {
            url: '/enfant',
            onEnter: function($state, $modal, SituationService) {
                $modal.open({
                    templateUrl: '/partials/foyer/enfant-modal.html',
                    controller: 'FoyerEnfantModalCtrl',
                    resolve: {
                        modalTitle: function() {
                            return 'Votre enfant';
                        }
                    }
                }).result.then(function(enfant) {
                    var situation = SituationService.restoreLocal();
                    situation.enfants.push(enfant);
                    SituationService.saveLocal(situation);

                    return $state.go("foyer");
                });
            }
        })
        .state('foyer.personne_a_charge_modal', {
            url: '/personne-a-charge',
            onEnter: function($state, $modal, SituationService) {
                $modal.open({
                    templateUrl: '/partials/foyer/enfant-modal.html',
                    controller: 'FoyerEnfantModalCtrl',
                    resolve: {
                        modalTitle: function() {
                            return 'Personne à charge';
                        }
                    }
                }).result.then(function(personne) {
                    var situation = SituationService.restoreLocal();
                    situation.personnesACharge.push(personne);
                    SituationService.saveLocal(situation);

                    return $state.go("foyer");
                });
            }
        })
        .state('foyer.capture_revenus', {
            url: '/capture-revenus',
            onEnter: function($state, $modal, $timeout, $rootScope, SituationService) {
                $timeout(function() {
                    $rootScope.$broadcast('animateCaptureRevenusStart');
                }, 700);

                $timeout(function() {
                    $rootScope.$broadcast('animateCaptureRevenusEnd');
                    $modal.open({
                        templateUrl: '/partials/foyer/capture-revenus-modal.html',
                        controller: 'CaptureRevenusModalCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            modalTitle: function() {
                                return 'Vos revenus et aides';
                            }
                        }
                    }).result.then(function(personne) {
                        return $state.go("logement");
                    });
                }, 2500);
            }
        })
        .state('situations_specifiques', {
            url: '/configuration/situations-specifiques',
            templateUrl: '/partials/situations-specifiques.html',
            controller: 'SituationsSpecifiquesCtrl'
        })
        .state('logement', {
            url: '/configuration/logement',
            templateUrl: '/partials/logement.html',
            controller: 'LogementCtrl'
        })
        .state('envoi_demande', {
            url: '/envoi-demande/:situationId',
            templateUrl: '/partials/envoi-demande.html',
            controller: 'EnvoiDemandeCtrl'
        });
});

ddsApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
