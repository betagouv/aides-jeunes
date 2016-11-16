
'use strict';

angular.module('ddsApp').controller('FoyerRessourceRfrCtrl', function($scope) {
    $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract('years', 2).format('YYYY');
    $scope.yearMoins1 = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.rfr = $scope.situation.rfr;

    $scope.submit = function(form) {
        if (! form.$valid)
            return document.querySelector('input[aria-invalid="true"]').focus();
        $scope.rfr = $scope.rfr !== undefined ? $scope.rfr : false; // rfr won't be updated in the database if the new value is undefined.
        $scope.$emit('rfr', $scope.rfr);
    };
});
