'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ddsCommon']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/partials/homepage.html'
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
                    controller: 'FoyerRecapLogementCtrl',
                    resolve: {
                        situation: ['SituationService', function(SituationService) {
                            return SituationService.restoreLocal();
                        }]
                    }
                },
                'patrimoine@foyer': {
                    templateUrl: '/partials/foyer/patrimoine.html'
                }
            }
        })
        .state('foyer.demandeur_modal', {
            url: '/demandeur',
            onEnter: ['$state', 'IndividuModalService', function($state, IndividuModalService) {
                IndividuModalService
                    .openDemandeur()
                    .finally(function() {
                        $state.go('foyer');
                    });
            }]
        })
        .state('foyer.conjoint_modal', {
            url: '/conjoint',
            onEnter: ['$state', 'IndividuModalService', function($state, IndividuModalService) {
                IndividuModalService
                    .openConjoint()
                    .finally(function() {
                        $state.go('foyer');
                    });
            }]
        })
        .state('foyer.enfant_modal', {
            url: '/enfant',
            onEnter: ['$state', 'IndividuModalService', function($state, IndividuModalService) {
                IndividuModalService
                    .openEnfant()
                    .finally(function() {
                        $state.go('foyer');
                    });
            }]
        })
        .state('foyer.personne_a_charge_modal', {
            url: '/personne-a-charge',
            onEnter: ['$state', 'IndividuModalService', function($state, IndividuModalService) {
                IndividuModalService
                    .openPersonneACharge()
                    .finally(function() {
                        $state.go('foyer');
                    });
            }]
        })
        .state('foyer.capture_ressources', {
            url: '/ressources',
            onEnter: ['$state', 'CaptureRessourcesModalService', function($state, CaptureRessourcesModalService) {
                CaptureRessourcesModalService.open(false).result.then(function() {
                    return $state.go('foyer');
                });
            }]
        })
        .state('foyer.capture_logement', {
            url: '/logement',
            onEnter: ['$state', '$modal', function($state, $modal) {
                $modal.open({
                    templateUrl: '/partials/foyer/capture-logement-modal.html',
                    controller: 'FoyerCaptureLogementModalCtrl',
                    resolve: {
                        situation: ['SituationService', function(SituationService) {
                            return SituationService.restoreLocal();
                        }]
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function() {
                    return $state.go('foyer');
                });
            }]
        })
        .state('foyer.capture_patrimoine', {
            url: '/patrimoine',
            onEnter: ['$state', '$modal', function($state, $modal) {
                $modal.open({
                    templateUrl: '/partials/foyer/capture-patrimoine-modal.html',
                    controller: 'FoyerCapturePatrimoineModalCtrl',
                    resolve: {
                        situation: ['SituationService', function(SituationService) {
                            return SituationService.restoreLocal();
                        }]
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function() {
                    return $state.go('foyer');
                });
            }]
        })
        .state('resultat', {
            url: '/resultat/:situationId',
            templateUrl: '/partials/resultat.html',
            controller: 'ResultatCtrl',
            resolve: {
                situation: ['$stateParams', 'SituationService', function($stateParams, SituationService) {
                    return SituationService.restoreRemote($stateParams.situationId);
                }]
            }
        })
        .state('resultat.capture_ressources_n_2', {
            url: '/ressources-n-2',
            onEnter: ['$state', 'CaptureRessourcesModalService', function($state, CaptureRessourcesModalService) {
                CaptureRessourcesModalService.open(true).result.then(function() {
                    return $state.go('resultat');
                });
            }]
        })
        .state('form_infos_complementaires_individus', {
            url: '/infos-complementaires/noms-prenoms?droit',
            templateUrl: '/partials/form-infos-complementaires/individus.html',
            controller: 'FormInfosComplementairesIndividusCtrl'
        })
        .state('form_infos_complementaires_address_contact', {
            url: '/infos-complementaires/adresse?droit',
            templateUrl: '/partials/form-infos-complementaires/address-contact.html',
            controller: 'FormInfosComplementairesAddressContactCtrl'
        })
        .state('form_infos_complementaires_situation_pro', {
            url: '/infos-complementaires/situation-professionnelle?droit',
            templateUrl: '/partials/form-infos-complementaires/situation-pro.html',
            controller: 'FormInfosComplementairesSituationProCtrl',
            resolve: {
                situation: ['SituationService', function(SituationService) {
                    return SituationService.restoreLocal();
                }]
            }
        })
        .state('download_cerfa', {
            url: '/telecharger-formulaires/:droit',
            templateUrl: '/partials/download-cerfa.html',
            controller: 'DownloadCerfaCtrl',
            resolve: {
                situation: ['SituationService', function(SituationService) {
                    return SituationService.restoreLocal();
                }],
                droit: ['$stateParams', function($stateParams) {
                    return $stateParams.droit;
                }]
            }
        })
        .state('envoi_demande', {
            url: '/envoi-demande/:situationId',
            templateUrl: '/partials/envoi-demande-teaser.html'
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, $modalStack, SituationService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // changement d'url vers /api => débranchement de ui-router
    $rootScope.$on('$locationChangeStart', function(e, location) {
        if (0 === location.indexOf($window.location.origin + '/api')) {
            e.preventDefault();
            $window.location.href = location;
        }
    });

    // fermeture d'une éventuelle modale rémanente au changement d'état (suite à des bugs récurrents)
    $rootScope.$on('$stateChangeStart', function() {
        var top = $modalStack.getTop();
        if (top) {
            $modalStack.dismiss(top.key);
        }
    });

    $rootScope.$on('$stateChangeStart', function(e, state) {
        if ('teaser' === state.name) {
            SituationService.newSituation();
        }
    });
});
