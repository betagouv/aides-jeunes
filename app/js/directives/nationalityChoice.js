'use strict';

var EEE_TEXT = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
    'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
    'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';

angular.module('ddsCommon').directive('nationalityChoice', function(ABTestingService, NationaliteService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/nationality-choice.html',
        scope: {
            individu: '=',
        },
        link(scope, element, attrs) {

            if (attrs.hasOwnProperty('type')) {
                scope.widget = attrs.type;
            } else {
                var abTesting = ABTestingService.getEnvironment();
                if (abTesting && abTesting.nationaliteWidget && abTesting.nationaliteWidget.value) {
                    scope.widget = abTesting.nationaliteWidget.value;
                } else {
                    scope.widget = 'select2';
                }
            }

            scope.nationalites = NationaliteService.getSortedArray();
            scope.popoverEee = EEE_TEXT;

            scope.selectNationalite = function(value) {
                scope.individu.nationalite_code = value;
                scope.individu.nationalite = NationaliteService.getNationaliteByCountryCode(value);
            };

            scope.changeRadio = function() {
                scope.individu.nationalite_code = NationaliteService.getCountryCodeByNationalite(scope.individu.nationalite);
            };
        },
    };
});
