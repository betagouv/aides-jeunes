'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    moment.lang('fr');

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
                'ressources@foyer': {
                    templateUrl: '/partials/foyer/recap-ressources.html',
                    controller: 'FoyerRecapRessourcesCtrl'
                },
                'logement@foyer': {
                    templateUrl: '/partials/foyer/recap-logement.html',
                    controller: 'FoyerRecapLogementCtrl'
                }
            }
        })
        .state('foyer.demandeur_modal', {
            url: '/demandeur',
            onEnter: ['$state', 'SituationService', 'IndividuModalService', function($state, SituationService, IndividuModalService) {
                var situation = SituationService.restoreLocal();
                IndividuModalService
                    .open({individuType: 'demandeur', modalTitle: 'Vous', cancelable: false})
                    .then(function() {
                        SituationService.saveLocal(situation);
                        return $state.go('foyer');
                    });
            }]
        })
        .state('foyer.conjoint_modal', {
            url: '/conjoint',
            onEnter: ['$state', 'SituationService', 'IndividuModalService', function($state, SituationService, IndividuModalService) {
                var situation = SituationService.restoreLocal();
                IndividuModalService
                    .open({individuType: 'conjoint', modalTitle: 'Votre conjoint', askRelationType: true})
                    .then(function(conjoint) {
                        situation.conjoint = conjoint;
                        SituationService.saveLocal(situation);

                        return conjoint;
                    }, function() {
                        situation.livesAlone = undefined;
                    }).finally(function() {
                        $state.go('foyer');
                    });
            }]
        })
        .state('foyer.enfant_modal', {
            url: '/enfant',
            onEnter: ['$state', 'SituationService', 'IndividuModalService', function($state, SituationService, IndividuModalService) {
                IndividuModalService
                    .open({individuType: 'enfant', modalTitle: 'Votre enfant', askFirstName: true})
                    .then(function(enfant) {
                        var situation = SituationService.restoreLocal();
                        situation.enfants.push(enfant);

                        return enfant;
                    }).finally(function() {
                        $state.go('foyer');
                    });
            }]
        })
        .state('foyer.personne_a_charge_modal', {
            url: '/personne-a-charge',
            onEnter: ['$state', 'SituationService', 'IndividuModalService', function($state, SituationService, IndividuModalService) {
                IndividuModalService
                    .open({individuType: 'personneACharge', modalTitle: 'Personne à charge', askFirstName: true})
                    .then(function(personne) {
                        var situation = SituationService.restoreLocal();
                        situation.personnesACharge.push(personne);

                        return personne;
                    }).finally(function() {
                        $state.go('foyer');
                    });
            }]
        })
        .state('foyer.capture_revenus', {
            url: '/capture-revenus',
            onEnter: ['$state', '$modal', 'SituationService', function($state, $modal, SituationService) {
                var situation = SituationService.restoreLocal();
                $modal.open({
                    templateUrl: '/partials/foyer/capture-revenus-modal.html',
                    controller: 'FoyerCaptureRevenusModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function() {
                    return $state.go('foyer');
                });
            }]
        })
        .state('foyer.situations_specifiques', {
            url: '/situations-specifiques',
            templateUrl: '/partials/foyer/situations-specifiques-modal.html',
            onEnter: ['$state', '$modal', 'SituationService', function($state, $modal, SituationService) {
                var situation = SituationService.restoreLocal();
                $modal.open({
                    templateUrl: '/partials/foyer/situations-specifiques-modal.html',
                    controller: 'FoyerSituationsSpecifiquesModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function() {
                    return $state.go('foyer');
                });
            }]
        })
        .state('logement', {
            url: '/configuration/logement',
            templateUrl: '/partials/logement.html',
            controller: 'LogementCtrl'
        })
        .state('resultat', {
            url: '/resultat',
            templateUrl: '/partials/resultat.html'
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
