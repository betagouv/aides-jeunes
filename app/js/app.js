'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ddsCommon', 'ngSanitize']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $uiViewScrollProvider.useAnchorScroll();

    var individuFormView = function(individuRole, captureRelationConjoint, capturePrenom, minAge, maxAge) {
        return {
            templateUrl: '/partials/foyer/individu-form.html',
            controller: 'FoyerIndividuFormCtrl',
            resolve: {
                options: function() {
                    return {
                        individuRole: individuRole,
                        captureRelationConjoint: captureRelationConjoint || false,
                        capturePrenom: capturePrenom || false,
                        minAge: minAge,
                        maxAge: maxAge
                    };
                }
            }
        };
    };

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/partials/homepage.html'
        })
        .state('a_propos', {
            url: '/a-propos',
            templateUrl: '/partials/a-propos.html'
        })
        .state('cgu', {
            url: '/conditions-generales-d-utilisation',
            templateUrl: '/partials/cgu.html'
        })
        .state('contribuez', {
            url: '/contribuez',
            templateUrl: '/partials/contribuez.html'
        })
        .state('faq', {
            url: '/faq',
            templateUrl: '/partials/faq.html'
        })
        .state('foyer', {
            abstract: true,
            url: '/foyer',
            templateUrl: '/partials/foyer/layout.html',
            controller: 'FoyerCtrl'
        })
        .state('foyer.demandeur', {
            url: '/demandeur',
            views: {
                '': {
                    templateUrl: '/partials/foyer/demandeur.html'
                },
                'individuForm@foyer.demandeur': individuFormView('demandeur')
            }
        })
        .state('foyer.conjoint', {
            url: '/conjoint',
            views: {
                '': {
                    templateUrl: '/partials/foyer/conjoint.html',
                    controller: 'FoyerConjointCtrl',
                },
                'individuForm@foyer.conjoint': individuFormView('conjoint', true)
            }
        })
        .state('foyer.enfants', {
            url: '/enfants',
            views: {
                '': {
                    templateUrl: '/partials/foyer/enfants.html',
                    controller: 'FoyerEnfantsCtrl'
                },
                'individuForm@foyer.enfants': individuFormView('enfant', false, true)
            }
        })
        .state('foyer.personnesACharge', {
            url: '/personnes-a-charge',
            views: {
                '': {
                    templateUrl: '/partials/foyer/personnes-a-charge.html',
                    controller: 'FoyerPersonnesAChargeCtrl'
                },
                'individuForm@foyer.personnesACharge': individuFormView('personneACharge', false, true)
            }
        })
        .state('foyer.logement', {
            url: '/logement',
            templateUrl: '/partials/foyer/logement.html',
            controller: 'FoyerLogementCtrl'
        })
        .state('foyer.ressources', {
            url: '/ressources',
            templateUrl: '/partials/foyer/ressources.html',
            controller: 'FoyerRessourcesCtrl',
            resolve: {
                individus: ['SituationService', function(SituationService) {
                    return SituationService.restoreLocal().individus;
                }]
            }
        })
        .state('foyer.patrimoine', {
            url: '/patrimoine',
            templateUrl: '/partials/foyer/patrimoine.html',
            controller: 'FoyerPatrimoineCtrl'
        })
        .state('foyer.simulation', {
            url: '/simulation/:situationId',
            templateUrl: '/partials/simulation.html',
            controller: 'SimulationCtrl',
            resolve: {
                situation: ['$stateParams', 'SituationService', function($stateParams, SituationService) {
                    return SituationService.restoreRemote($stateParams.situationId);
                }]
            }
        })
        .state('infos_complementaires', {
            abstract: true,
            url: '/infos-complementaires',
            templateUrl: '/partials/form-infos-complementaires/layout.html'
        })
        .state('infos_complementaires.individus', {
            url: '/noms-prenoms?droit',
            templateUrl: '/partials/form-infos-complementaires/individus.html',
            controller: 'FormInfosComplementairesIndividusCtrl'
        })
        .state('infos_complementaires.adresse_contact', {
            url: '/adresse?droit',
            templateUrl: '/partials/form-infos-complementaires/adresse-contact.html',
            controller: 'FormInfosComplementairesAdresseContactCtrl'
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
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, $modalStack, SituationService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.newSituation = SituationService.newSituation;

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

    $rootScope.$on('$stateChangeSuccess', function() {
        if ($window._paq) {
            $window._paq.push(['trackPageView']);
        }
    });
});
