'use strict';

var ddsApp = angular.module('ddsApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ddsCommon', 'ngSanitize']);

ddsApp.config(function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $uiViewScrollProvider.useAnchorScroll();

    var individuFormView = function(individuRole, captureRelationConjoint, capturePrenom) {
        return {
            templateUrl: '/partials/foyer/individu-form.html',
            controller: 'FoyerIndividuFormCtrl',
            resolve: {
                options: function() {
                    return {
                        individuRole: individuRole,
                        captureRelationConjoint: captureRelationConjoint || false,
                        capturePrenom: capturePrenom || false,
                        checkResidenceStability: _.contains(['demandeur', 'conjoint'], individuRole),
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
            controller: 'ContribuezCtrl',
            templateUrl: '/partials/contribuez.html',
            abstract: true,
            resolve: {
                acceptanceTests: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.get({
                        state: ['validated']
                    });
                },
                keywords: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getKeywords();
                }
            },
            data: {
                pageTitle: 'Contribuez ! - '
            }
        })
        .state('contribuez.list', {
            url: '',
            templateUrl: '/acceptance-tests/partials/test-list.html',
            controller: 'TestListCtrl'
        })
        .state('faq', {
            url: '/faq',
            templateUrl: '/partials/faq.html',
            data: {
                pageTitle: 'FAQ - '
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
                'individuForm@foyer.conjoint': individuFormView('conjoint', true)
            }
        })
        .state('foyer.personnesACharge', {
            url: '/personnes-a-charge',
            views: {
                '': {
                    templateUrl: '/partials/foyer/personnes-a-charge.html',
                    controller: 'FoyerPersonnesAChargeCtrl'
                },
                'enfantForm@foyer.personnesACharge': individuFormView('enfant', false, true),
                'personneAChargeForm@foyer.personnesACharge': individuFormView('personneACharge', false, true),
                'personneSousMemeToitForm@foyer.personnesACharge': individuFormView('personneSousMemeToit', false, true)
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
        .state('foyer.ressources.types', {
            templateUrl: '/partials/foyer/ressources/types.html',
            controller: 'FoyerRessourceTypesCtrl',
            url: '/:individu/types'
        })
        .state('foyer.rfr', {
            templateUrl: '/partials/foyer/ressources/rfr.html',
            controller: 'FoyerRessourceRfrCtrl',
            url: '/ressources/rfr'
        })
        .state('foyer.ressourcesYearMoins2', {
            templateUrl: '/partials/foyer/ressources/year-moins-2.html',
            controller: 'FoyerRessourceYearMoins2Ctrl',
            url: '/ressources/revenus-impots'
        })
        .state('foyer.patrimoine', {
            url: '/patrimoine',
            templateUrl: '/partials/foyer/patrimoine.html',
            controller: 'FoyerPatrimoineCtrl'
        })
        .state('foyer.simulation', {
            url: '/simulation/:situationId',
            templateUrl: '/partials/simulation.html',
            controller: 'SimulationCtrl'
        })
        .state('infos_complementaires', {
            abstract: true,
            url: '/infos-complementaires',
            templateUrl: '/partials/form-infos-complementaires/layout.html',
            data: {
                pageTitle: 'Informations complémentaires - '
            }
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
            },
            data: {
                pageTitle: 'Téléchargement formulaires - '
            }
        });
});

ddsApp.run(function($rootScope, $state, $stateParams, $window, $modalStack, $anchorScroll) {
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
        var top = $modalStack.getTop();
        if (top) {
            $modalStack.dismiss(top.key);
        }
    });

    $rootScope.$on('$locationChangeSuccess', function(event, current) {
        if ($window._paq) {
            $window._paq.push(['setCustomUrl', current]);
            $window._paq.push(['trackPageView']);
        }
    });
});
