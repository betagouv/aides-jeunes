'use strict';

angular.module('ddsCommon').directive('montantRessources', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/foyer/ressources/montants.html',
        scope: {
            individuRef: '=',
            debutAnnee: '=',
            finAnnee: '=',
            months: '='
        },
        link: function($scope) {
            $scope.individu = $scope.individuRef.individu;
            $scope.yearMoinsUn = moment().subtract('years', 1).format('YYYY');

            $scope.isRessourceTypeNonTns = function(ressource) {
                return 'tns' !== ressource.category;
            };

            $scope.isRessourceTypeMicroTns = function(ressource) {
                return 'tns' === ressource.category && 'autresRevenusTns' !== ressource.id;
            };

            $scope.isRessourceNonTns = function(ressource) {
                return $scope.isRessourceTypeNonTns(ressource.type);
            };

            $scope.isRessourceMicroTns = function(ressource) {
                return $scope.isRessourceTypeMicroTns(ressource.type);
            };

            $scope.isRessourceOtherTns = function(ressource) {
                return 'autresRevenusTns' === ressource.type.id;
            };

            $scope.montantInvalide = function(montant) {
                return !angular.isNumber(montant);
            };

            $scope.updateMontantAnnuel = function(ressource) {
                var monthsSum = ressource.months[0].montant + ressource.months[1].montant + ressource.months[2].montant;
                if (!_.isNaN(monthsSum)) {
                    ressource.montantAnnuel = Math.round(4 * monthsSum);
                }
            };
        }
    };
});
