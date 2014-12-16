'use strict';

angular.module('ddsApp').controller('FoyerRessourceRfrCtrl', function($scope, $state) {
    $scope.yearMoins2 = moment().subtract('years', 2).format('YYYY');
    $scope.yearMoins1 = moment().subtract('years', 1).format('YYYY');
    $scope.rfr = 0;
    $scope.situationFamilialeChanged = false;

    $scope.submit = function() {
        $scope.situation.rfr = $scope.rfr;
        $state.go('foyer.ressourcesYearMoins2');
    };
});
