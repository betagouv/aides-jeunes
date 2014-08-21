'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ddsCommon']);

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
                    templateUrl: '/partials/foyer/logement.html',
                    controller: 'FoyerLogementCtrl'
                },
                'immobilier@foyer': {
                    templateUrl: '/partials/foyer/immobilier.html'
                }
            }
        })
        .state('foyer.demandeur_modal', {
            url: '/demandeur',
            onEnter: ['$state', 'SituationService', 'IndividuModalService', function($state, SituationService, IndividuModalService) {
                var situation = SituationService.restoreLocal();
                IndividuModalService
                    .open({individuType: 'demandeur', modalTitle: 'Vous', cancelable: false, checkResidenceStability: true})
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
                    .open({individuType: 'conjoint', modalTitle: 'Votre conjoint', askRelationType: true, checkResidenceStability: true})
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
        .state('foyer.situations_specifiques', {
            url: '/situations-specifiques',
            onEnter: ['$state', '$modal', function($state, $modal) {
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
        .state('foyer.capture_revenus', {
            url: '/ressources',
            onEnter: ['$state', '$modal', function($state, $modal) {
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
        .state('foyer.capture_immobilier', {
            url: '/biens-mobiliers-immobiliers',
            onEnter: ['$state', '$modal', function($state, $modal) {
                $modal.open({
                    templateUrl: '/partials/foyer/capture-immobilier-modal.html',
                    controller: 'FoyerCaptureImmobilierModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function() {
                    return $state.go('foyer');
                });
            }]
        })
        .state('resultat', {
            url: '/resultat/:situationId?requestedCerfa',
            templateUrl: '/partials/resultat.html',
            controller: 'ResultatCtrl',
            resolve: {
                situation: ['$stateParams', 'SituationService', function($stateParams, SituationService) {
                    if ('current' === $stateParams.situationId) {
                        return SituationService.restoreLocal();
                    }

                    return SituationService.find($stateParams.situationId);
                }]
            }
        })
        .state('form_infos_complementaires_individus', {
            url: '/infos-complementaires/noms-prenoms?requestedCerfa',
            templateUrl: '/partials/form-infos-complementaires/individus.html',
            controller: 'FormInfosComplementairesIndividusCtrl'
        })
        .state('form_infos_complementaires_address_contact', {
            url: '/infos-complementaires/adresse?requestedCerfa',
            templateUrl: '/partials/form-infos-complementaires/address-contact.html',
            controller: 'FormInfosComplementairesAddressContactCtrl'
        })
        .state('form_infos_complementaires_situation_pro', {
            url: '/infos-complementaires/situation-professionnelle?requestedCerfa',
            templateUrl: '/partials/form-infos-complementaires/situation-pro.html',
            controller: 'FormInfosComplementairesSituationProCtrl',
            resolve: {
                situation: ['SituationService', function(SituationService) {
                    return SituationService.restoreLocal();
                }]
            }
        })
        .state('download_cerfa', {
            url: '/telecharger-formulaire/:cerfa',
            templateUrl: '/partials/download-cerfa.html',
            controller: 'DownloadCerfaCtrl',
            resolve: {
                situation: ['SituationService', function(SituationService) {
                    return SituationService.restoreLocal();
                }],
                cerfa: ['$stateParams', function($stateParams) {
                    return $stateParams.cerfa;
                }]
            }
        })
        .state('envoi_demande', {
            url: '/envoi-demande/:situationId?requestedCerfa',
            templateUrl: '/partials/envoi-demande-teaser.html'
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, $modalStack) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$locationChangeStart', function(e, location) {
        if (0 === location.indexOf($window.location.origin + '/api')) {
            e.preventDefault();
            $window.location.href = location;
        }
    });

    $rootScope.$on('$stateChangeStart', function() {
        var top = $modalStack.getTop();
        if (top) {
            $modalStack.dismiss(top.key);
        }
    });
});
