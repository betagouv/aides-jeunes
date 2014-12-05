'use strict';

angular.module('ddsApp').directive('formDeclarationRevenusImpots', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/foyer/ressources/form-declaration-revenus-impots.html',
        scope: {
            individu: '='
        },
        controller: function($scope, IndividuService) {
            $scope.individuLabel = IndividuService.label;
        }
    };
});
