
'use strict';

angular.module('ddsApp').controller('FoyerRessourceRfrCtrl', function($scope) {
    $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract(2, 'years').format('YYYY');
    $scope.yearMoins1 = moment($scope.situation.dateDeValeur).subtract(1, 'years').format('YYYY');

    $scope.situation.foyer_fiscal.rfr = $scope.situation.foyer_fiscal.rfr || {};
    $scope.rfr = $scope.situation.foyer_fiscal.rfr;

    $scope.submit = function() {
        $scope.$emit('rfr');
    };
});
