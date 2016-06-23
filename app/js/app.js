'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ddsCommon', 'ngSanitize']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
    moment.lang('fr');

    var CURRENT_YEAR_TWO_DIGITS = (new Date()).getFullYear() - 2000;
    moment.parseTwoDigitYear = function(input) {  // see https://github.com/moment/moment/issues/2219
        input = parseInt(input);
        return input + (input <= CURRENT_YEAR_TWO_DIGITS ? 2000 : 1900);
    };

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $uiViewScrollProvider.useAnchorScroll();

    var individuFormView = function(individuRole) {
        return {
            templateUrl: '/partials/foyer/individu-form.html',
            controller: 'FoyerIndividuFormCtrl',
            resolve: {
                individuRole: function() {
                    return individuRole;
                }
            }
        };
    };

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/partials/homepage.html',
            controller: 'HomepageCtrl'
        })
        .state('a_propos', {
            url: '/a-propos',
            templateUrl: '/partials/a-propos.html',
            data: {
                pageTitle: 'A propos - '
            }
        })
        .state('cgu', {
            url: '/conditions-generales-d-utilisation',
            templateUrl: '/partials/cgu.html',
            data: {
                pageTitle: 'Conditions générales d\'utilisation - '
            }
        })
        .state('contribuez', {
            url: '/contribuez',
            templateUrl: '/partials/contribuez.html',
            controller: 'ContribuezCtrl',
            data: {
                pageTitle: 'Contribuez ! - '
            }
        })
        .state('faq', {
            url: '/faq',
            templateUrl: '/partials/faq.html',
            data: {
                pageTitle: 'FAQ - '
            }
        })
        .state('communication', {
            url: '/communication',
            templateUrl: '/partials/communication.html',
            data: {
                pageTitle: 'Communication - '
            }
        })
        .state('tests', {
            url: '/tests',
            onEnter: function($window) {
                $window.location.href = '/tests';
            }
        })
        .state('foyer', {
            abstract: true,
            url: '/foyer',
            views: {
                '': {
                    controller: 'FoyerCtrl',
                    templateUrl: '/partials/foyer/layout.html',
                },
                'recap_situation@foyer': {
                    controller: 'RecapSituationCtrl',
                    templateUrl: '/partials/foyer/recap-situation.html'
                }
            },
            data: {
                pageTitle: 'Simulation - '
            }
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
                'individuForm@foyer.conjoint': individuFormView('conjoint')
            }
        })
        .state('foyer.enfants', {
            url: '/enfants',
            views: {
                '': {
                    templateUrl: '/partials/foyer/enfants.html',
                    controller: 'FoyerEnfantsCtrl'
                },
                'enfantForm@foyer.enfants': individuFormView('enfant'),
            }
        })
        .state('foyer.logement', {
            url: '/logement',
            templateUrl: '/partials/foyer/logement.html',
            controller: 'FoyerLogementCtrl'
        })
        .state('foyer.ressources', {
            url: '/ressources',
            controller: 'FoyerRessourcesCtrl',
            templateUrl: '/partials/foyer/ressources/layout.html'
        })
        .state('foyer.ressources.enfants', {
            templateUrl: '/partials/foyer/ressources/enfants.html',
            controller: 'FoyerRessourcesEnfantsCtrl',
            url: '/enfants/'
        })
        .state('foyer.ressources.individu', {
            controller: 'FoyerRessourcesIndividuCtrl',
            url:'/:individu',
            templateUrl: '/partials/foyer/ressources/layout.html'
        })
        .state('foyer.ressources.individu.types', {
            templateUrl: '/partials/foyer/ressources/types.html',
            controller: 'FoyerRessourceTypesCtrl',
            url: '/types'
        })
        .state('foyer.ressources.individu.montants', {
            templateUrl: '/partials/foyer/ressources/montants.html',
            controller: 'FoyerRessourcesMontantsCtrl',
            url: '/montants'
        })
        .state('foyer.pensionsAlimentaires', {
            templateUrl: '/partials/foyer/pensions-alimentaires.html',
            controller: 'FoyerPensionsAlimentairesCtrl',
            url: '/pensions-alimentaires'
        })
        .state('foyer.resultat', {
            url: '/resultat',
            templateUrl: '/partials/resultat.html',
            controller: 'ResultatCtrl'
        })
        .state('foyer.ressourcesYearMoins2', {
            templateUrl: '/partials/foyer/ressources/year-moins-2.html',
            controller: 'FoyerRessourceYearMoins2Ctrl',
            url: '/revenus-impots'
        })
        .state('foyer.rfr', {
            templateUrl: '/partials/foyer/ressources/rfr.html',
            controller: 'FoyerRessourceRfrCtrl',
            url: '/rfr'
        })
        .state('foyer.patrimoine', {
            url: '/patrimoine',
            templateUrl: '/partials/foyer/patrimoine.html',
            controller: 'FoyerPatrimoineCtrl'
        })
        .state('foyer.download_cerfa', {
            url: '/telecharger-formulaires/:droit',
            templateUrl: '/partials/download-cerfa.html',
            controller: 'DownloadCerfaCtrl',
            resolve: {
                situation: function(SituationService) {
                    return SituationService.restoreLocal();
                },
                droit: function($stateParams) {
                    return $stateParams.droit;
                }
            },
            data: {
                pageTitle: 'Téléchargement formulaires - '
            }
        })
        .state('situation', {
            url: '/situations/:situationId',
            template: '',
            controller: function(SituationService, $state, $stateParams) {
                SituationService.restoreRemote($stateParams.situationId).then(function() {
                    $state.go('foyer.resultat', { situationId: $stateParams.situationId });
                });
            }
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, $uibModalStack, $anchorScroll) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // Offset de l'anchorscroll à 60px, nécessaire à cause de la navbar en position fixed
    $anchorScroll.yOffset = 60;

    // changement d'url vers /api => débranchement de ui-router
    $rootScope.$on('$locationChangeStart', function(e, location) {
        if (0 === location.indexOf($window.location.origin + '/api')) {
            e.preventDefault();
            $window.location.href = location;
        }
    });

    // fermeture d'une éventuelle modale rémanente au changement d'état (suite à des bugs récurrents)
    $rootScope.$on('$stateChangeStart', function() {
        var top = $uibModalStack.getTop();
        if (top) {
            $uibModalStack.dismiss(top.key);
        }
    });

    $rootScope.$on('$locationChangeSuccess', function(event, current) {
        if ($window._paq) {
            $window._paq.push(['setCustomUrl', current]);
            $window._paq.push(['trackPageView']);
        }
    });
});
