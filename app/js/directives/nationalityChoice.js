'use strict';

var EEE_TEXT = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
    'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
    'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';

angular.module('ddsCommon').directive('nationalityChoice', function($analytics, ABTestingService, NationaliteService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/nationality-choice.html',
        scope: {
            individu: '=',
        },
        link(scope , element, attrs) {

            if (attrs.hasOwnProperty('widget')) {
                scope.widget = attrs.type;
            } else {
                var abTesting = ABTestingService.getEnvironment();
                if (abTesting && abTesting.nationaliteWidget && abTesting.nationaliteWidget.value) {
                    scope.widget = abTesting.nationaliteWidget.value;
                } else {
                    scope.widget = 'select';
                }
            }

            scope.nationalites = NationaliteService.getSortedArray();
            scope.nationalite = '';
            scope.popoverEee = EEE_TEXT;

            if (scope.individu.nationalite) {
                scope.nationalite = scope.individu.nationalite;
            }
            if (scope.individu.nationalite_code) {
                scope.nationaliteCode = _.find(scope.nationalites, function(item) {
                    return item.code === scope.individu.nationalite_code;
                });
            }

            scope.$watch('nationalite', function(value) {
                scope.individu.nationalite = value;
            });
            scope.$watch('nationaliteCode', function(value) {
                scope.individu.nationalite_code = value.code;
                scope.individu.nationalite = NationaliteService.getNationaliteByCountryCode(value.code);
            });

            scope.selectNationalite = function(item) {
                scope.nationaliteCode = item;
                $analytics.eventTrack('select', { category: 'Nationalité', label: item.name });
            };

            // The function below allows to grab events when the user is typing
            // @see https://github.com/angular-ui/ui-select/issues/499#issuecomment-287316355
            var bindingDone = false;
            scope.bindEvents = function($select) {
                if (! bindingDone) {
                    $select.searchInput.on('keyup', _.debounce(function() {
                        if (this.value) {
                            $analytics.eventTrack('input', { category: 'Nationalité', label: this.value });
                        }
                    }, 200));
                    bindingDone = true;
                }
            };
        },
    };
});
