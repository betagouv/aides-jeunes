'use strict';

var EEE_TEXT = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
    'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
    'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';

function lookupObject(nationalites, code) {
    return _.find(nationalites, function(item) {
        return item.code === code;
    });
}

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

            scope.nationalites = NationaliteService.toArray();
            scope.popoverEee = EEE_TEXT;

            scope.nationaliteObject = lookupObject(scope.nationalites, scope.individu.nationalite_code);

            scope.selectNationalite = function(item) {
                if (item) {
                    scope.nationaliteObject = lookupObject(scope.nationalites, item.originalObject.code);
                    scope.individu.nationalite_code = item.originalObject.code;
                    scope.individu.nationalite = NationaliteService.getNationaliteByCountryCode(item.originalObject.code);
                }
            };

            scope.changeRadio = function() {
                scope.individu.nationalite_code = NationaliteService.getCountryCodeByNationalite(scope.individu.nationalite);
                scope.nationaliteObject = lookupObject(scope.nationalites, scope.individu.nationalite_code);
            };

            scope.focusIn = function() {
                scope.$broadcast('angucomplete-alt:clearInput', 'nationalite');
            };

            scope.focusOut = function() {
                scope.$broadcast('angucomplete-alt:changeInput', 'nationalite', scope.nationaliteObject);
            };

            scope.search = NationaliteService.search;
        },
    };
});
