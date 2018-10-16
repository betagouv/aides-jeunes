'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ddsCommon', 'ngSanitize', 'angulartics', 'angulartics.piwik']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
    moment.locale('fr');

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
            controller: 'HomepageCtrl',
            preventFocus: true
        })
        .state('a-propos', {
            url: '/a-propos',
            templateUrl: '/content-pages/a-propos.html',
            data: {
                pageTitle: 'À propos'
            }
        })
        .state('aah-en-test', {
            url: '/aah-en-test',
            templateUrl: '/content-pages/aah-en-test.html',
            controller: function($scope, droitsDescription, TrampolineService) {
                $scope.aah = droitsDescription.prestationsNationales.caf.prestations.aah;

                var trampoline = TrampolineService.get();
                if (! trampoline) {
                    return;
                }
                $scope.situationId = trampoline.situationId;
                $scope.montant = trampoline.montant;
            },
            data: {
                pageTitle: 'Montant de l’AAH – Mes Aides est en phase de test',
            }
        })
        .state('ameli', {
            url: '/ameli',
            templateUrl: '/content-pages/ameli.html',
            data: {
                pageTitle: 'Bienvenue sur Mes Aides'
            }
        })
        .state('ameliorer', {
            url: '/ameliorer',
            templateUrl: '/content-pages/ameliorer.html',
            data: {
                pageTitle: 'Améliorer'
            }
        })
        .state('cgu', {
            url: '/cgu',
            templateUrl: '/content-pages/cgu.html',
            data: {
                pageTitle: 'Conditions générales d’utilisation'
            },
            controller: function($scope, SituationService) {
                $scope.situationId = SituationService.restoreLocal()._id;
            }
        })
        .state('cgu_donnees', {
            url: '/cgu#donnees',
            templateUrl: '/content-pages/cgu.html',
            data: {
                pageTitle: 'Conditions générales d’utilisation'
            },
            controller: function($scope, SituationService) {
                $scope.situationId = SituationService.restoreLocal()._id;
            }
        })
        .state('communication', {
            url: '/communication',
            templateUrl: '/content-pages/communication.html',
            data: {
                pageTitle: 'Supports de communication'
            }
        })
        .state('contact', {
            url: '/contact',
            templateUrl: '/content-pages/contact.html',
            data: {
                pageTitle: 'Contact'
            },
            controller: function($scope, ABTestingService) {
                var ABTesting = ABTestingService.getABTestingEnvironment();
                $scope.contactABTestingEnv = (ABTesting.contact && ABTesting.contact.value) || 'A';
            }
        })
        .state('hameconnage', {
            url: '/hameconnage',
            templateUrl: '/content-pages/hameconnage.html',
            data: {
                pageTitle: '⚠️ Hameçonnage ⚠️'
            },
            controller: function($scope) {
                $scope.referrer = document.referrer;
            }
        })
        .state('liens-utiles', {
            url: '/liens-utiles',
            templateUrl: '/content-pages/liens-utiles.html',
            data: {
                pageTitle: 'Liens utiles'
            }
        })
        .state('social', {
            url: '/social',
            templateUrl: '/content-pages/social.html',
            data: {
                pageTitle: 'Réseaux sociaux'
            }
        })
        .state('sos', {
            url: '/sos',
            templateUrl: '/content-pages/sos.html',
            data: {
                pageTitle: 'SOS'
            }
        })
        .state('stats', {
            url: '/stats',
            templateUrl: '/partials/stats.html',
            controller: 'StatsCtrl',
        })
        .state('tests', {
            url: '/tests',
            onEnter: function($window) {
                $window.location.href = '/tests';
            }
        })
        .state('validation', {
            url: '/validation',
            templateUrl: '/partials/validation.html',
            controller: 'ValidationCtrl'
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
                pageTitle: 'Simulation'
            }
        })
        .state('foyer.demandeur', {
            url: '/demandeur',
            views: {
                '': {
                    templateUrl: '/partials/foyer/demandeur.html'
                },
                'individuForm@foyer.demandeur': individuFormView('demandeur')
            },
            preventFocus: true
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
                    controller: 'FoyerEnfantsCtrl',
                },
                'validate@foyer.enfants': {
                    templateUrl: '/partials/foyer/enfants/validate.html',
                },
            }
        })
        .state('foyer.enfants.ajouter', {
            url: '/ajouter',
            views: {
                'enfantForm': {
                    controller: 'FoyerNewEnfantCtrl',
                    templateUrl: '/partials/foyer/enfants/form.html',
                },
                'form@foyer.enfants.ajouter': individuFormView('enfant'),
                'validate@foyer.enfants': {
                    templateUrl: '/partials/foyer/enfants/validate.html',
                },
            }
        })
        .state('foyer.enfants.modifier', {
            url: '/:id',
            templateUrl: '/partials/foyer/enfants.html',
            views: {
                'enfantForm': {
                    controller: 'FoyerEnfantCtrl',
                    templateUrl: '/partials/foyer/enfants/form.html',
                },
                'form@foyer.enfants.modifier': individuFormView('enfant'),
                'validate@foyer.enfants': {
                    templateUrl: '/partials/foyer/enfants/validate.html',
                },
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
            url: '/:individu',
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
            url: '/resultat?situationId',
            templateUrl: '/partials/resultat.html',
            controller: 'ResultatCtrl'
        }).state('foyer.resultat.suggestion', {
            url: '/suggestion',
            templateUrl: '/partials/suggestion.html',
            controller: 'SuggestionCtrl'
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
        .state('redirection', {
            url: '/redirection?vers',
            templateUrl: '/partials/redirection.html',
            controller: 'RedirectionCtrl'
        })
        .state('situation', { // Route used by Ludwig
            url: '/situations/:situationId',
            template: '',
            controller: function(SituationService, $state, $stateParams) {
                $state.go('foyer.resultat', { situationId: $stateParams.situationId });
            }
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, $anchorScroll, $timeout) {
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

    $rootScope.$on('$stateChangeSuccess', function focusTitleForScreenReaders(event, current) {
        if (current.preventFocus)
            return;

        $timeout(function() {  // add the function to the next angular digest cycle, waiting for the page to load before executing it
            var title = document.querySelector('h1');
            // if anyone wants to set a tabindex manually, do not overwrite it
            if (title && title.tabIndex < 0) {  // default is -1... https://html.spec.whatwg.org/multipage/interaction.html#dom-tabindex
                title.tabIndex = -1;  //...yet it has to be set to -1 to allow `.focus()`
                title.focus();
            }
        });
    });

    $rootScope.$on('$locationChangeSuccess', function(event, current) {
        if ($window._paq) {
            $window._paq.push(['setCustomUrl', current]);
            $window._paq.push(['trackPageView']);
        }
    });
});
