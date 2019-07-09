'use strict';

var EEE_TEXT = 'Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, ' +
    'France, Grèce, Hongrie, Irlande, Islande, Italie, Lettonie, Liechtenstein, Lituanie, Luxembourg, Malte, Norvège, Pays-Bas, ' +
    'Pologne, Portugal, République Tchèque, Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède.';

angular.module('ddsCommon').directive('nationalityChoice', function(NationaliteService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/nationality-choice.html',
        scope: {
            individu: '=',
            widget: '@'
        },
        link(scope , element, attrs) {
            if (attrs.hasOwnProperty('widget')) {
                scope.widget = attrs.widget;
            }
        },
        controller: function($scope) {

            $scope.nationalites = NationaliteService.getSortedArray();
            $scope.nationalite = '';
            $scope.popoverEee = EEE_TEXT;
            $scope.widget = $scope.widget || 'select';

            if ($scope.individu.nationalite) {
                $scope.nationalite = $scope.individu.nationalite;
            }
            if ($scope.individu.nationalite_code) {
                $scope.nationaliteCode = _.find($scope.nationalites, function(item) {
                    return item.code === $scope.individu.nationalite_code;
                });
            }

            $scope.$watch('nationalite', function(value) {
                $scope.individu.nationalite = value;
            });
            $scope.$watch('nationaliteCode', function(value) {
                $scope.individu.nationalite_code = value.code;
            });

            $scope.selectNationalite = function(item) {
                $scope.individu.nationalite = NationaliteService.getNationaliteByCountryCode(item.code);
                $scope.individu.nationalite_code = item.code;
            };
        }
    };
});
