'use strict';

const Sentry = require('@sentry/browser');

// Use Webpack's require.context to manage dynamic requires for templates
// The templates will be cached when the application is booted
// https://webpack.js.org/guides/dependency-management/#require-context
var template = require.context('../views', true, /(partials|content-pages)\/.*\.html$/);

var requires = ['ui.router', 'ngAnimate', 'ddsCommon', 'ngSanitize', 'angulartics', 'angulartics.piwik', 'angucomplete-alt'];

const hasSentry = Sentry.getCurrentHub().getClient() !== undefined;

// Add ngSentry if Sentry is initialized
if (hasSentry) {
    requires.push('ngSentry');
}

var ddsApp = angular.module('ddsApp', requires);

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

    var individuFormView = function() {

        return {
            templateUrl: '/partials/foyer/individu-form.html',
            controller: 'FoyerIndividuFormCtrl',
        };
    };

    var resolveIndividuRole = function(individuRole) {

        return {
            individuRole: function() {
                return individuRole;
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
        .state('init-ci', {
            url: '/init-ci',
            data: {
                robots: 'noindex'
            },
            controller: function($state/*, ABTestingService*/) {
                $state.go('home');
            }
        })
        .state('a-propos', {
            url: '/a-propos',
            templateUrl: '/content-pages/a-propos.html',
            data: {
                pageTitle: 'À propos'
            }
        })
        .state('ameli', {
            url: '/ameli',
            templateUrl: '/content-pages/ameli.html',
            data: {
                pageTitle: 'Bienvenue sur Mes Aides',
                robots: 'noindex'
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
            }
        })
        .state('hameconnage', {
            url: '/hameconnage',
            templateUrl: '/content-pages/hameconnage.html',
            data: {
                pageTitle: '⚠️ Hameçonnage ⚠️',
                robots: 'noindex'
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
            data: {
                robots: 'noindex'
            },
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
                },
                'etablissements@foyer': {
                    controller: 'EtablissementsCtrl',
                    templateUrl: '/partials/etablissements-default.html'
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
            resolve: resolveIndividuRole('demandeur'),
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
            },
            resolve: resolveIndividuRole('conjoint'),
            data: {
                guard: true,
                robots: 'noindex'
            }
        })
        .state('foyer.enfants', {
            url: '/enfants',
            views: {
                '': {
                    templateUrl: '/partials/foyer/enfants.html',
                    controller: 'FoyerEnfantsCtrl',
                },
            },
            data: {
                guard: true,
                robots: 'noindex'
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
            },
            resolve: resolveIndividuRole('enfant'),
        })
        .state('foyer.enfants.modifier', {
            url: '/:id',
            views: {
                '': {
                    templateUrl: '/partials/foyer/enfants.html',
                },
                'enfantForm': {
                    controller: 'FoyerEnfantCtrl',
                    templateUrl: '/partials/foyer/enfants/form.html',
                },
                'form@foyer.enfants.modifier': individuFormView('enfant'),
            },
            resolve: resolveIndividuRole('enfant'),
        })
        .state('foyer.logement', {
            url: '/logement',
            templateUrl: '/partials/foyer/logement.html',
            controller: 'FoyerLogementCtrl',
            data: {
                guard: true,
                robots: 'noindex'
            }
        })
        .state('foyer.ressources', {
            url: '/ressources',
            controller: 'FoyerRessourcesCtrl',
            templateUrl: '/partials/foyer/ressources/layout.html',
            data: {
                guard: true,
                robots: 'noindex'
            }
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
            url: '/pensions-alimentaires',
            data: {
                guard: true,
                robots: 'noindex'
            }
        })
        .state('foyer.resultat', {
            url: '/resultat?situationId',
            templateUrl: '/partials/resultat.html',
            controller: 'ResultatCtrl',
            data: {
                robots: 'noindex'
            }
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
            controller: 'RedirectionCtrl',
            data: {
                robots: 'noindex'
            }
        })
        .state('situation', { // Route used by Ludwig
            url: '/situations/:situationId',
            template: '',
            controller: function(SituationService, $state, $stateParams) {
                $state.go('foyer.resultat', { situationId: $stateParams.situationId });
            },
            data: {
                robots: 'noindex'
            }
        })
        .state('suivi', {
            url: '/suivi?token',
            templateUrl: '/partials/suivi.html',
            controller: 'SuiviCtrl',
            data: {
                robots: 'noindex'
            }
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, $analytics, $anchorScroll, $templateCache, $timeout, $transitions, SituationService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // Offset de l'anchorscroll à 60px, nécessaire à cause de la navbar en position fixed
    $anchorScroll.yOffset = 60;

    if (hasSentry) {
        Sentry.getCurrentHub().getScope().addEventProcessor(function(event) {
            if (event && event.event_id) {
                $analytics.eventTrack('Sentry', { label: event.event_id });
            }

            return event;
        });
    }

    $transitions.onSuccess({}, function focusTitleForScreenReaders(transition) {
        if (transition.to().preventFocus)
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

    // Update <meta name="robots"> in vanilla JavaScript,
    // because nothing else works
    $transitions.onSuccess({}, function(transition) {

        var robots = $window.document.querySelector('head meta[name="robots"]');
        if (! robots) {

            return;
        }

        var state = transition.to();
        if (state.data && state.data.robots) {
            robots.content = state.data.robots;
        } else {
            robots.content = 'index,follow';
        }
    });

    // Prevent direct access to a state if the user has not completed the foyer.demandeur state
    // @see https://ui-router.github.io/guide/transitionhooks#redirecting-a-transition
    $transitions.onStart({}, function(transition) {
        var to = transition.to();
        // The data.guard attribute is inherited when states are nested
        if (to.data && to.data.guard) {
            var situation = SituationService.restoreLocal();
            if (! SituationService.passSanityCheck(situation)) {

                return transition.router.stateService.target('foyer.demandeur');
            }
        }
    });

    // Preload templates in cache
    // We use the keys() function of the context module API
    // to iterate over the templates, and we store them in Angular's template cache.
    // This means Angular won't try to load the template via AJAX
    _.forEach(template.keys(), function(path) {
        var cacheKey = path.replace('./', '/');
        $templateCache.put(cacheKey, template(path));
    });
});
