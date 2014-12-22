'use strict';

angular.module('ddsApp').controller('FoyerRessourceRfrCtrl', function($scope, $state, SituationService) {
    $scope.yearMoins2 = moment().subtract('years', 2).format('YYYY');
    $scope.yearMoins1 = moment().subtract('years', 1).format('YYYY');
    $scope.rfr = $scope.situation.rfr || 0;
    $scope.situationFamilialeChanged = false;

    $scope.submit = function() {
        $scope.situation.rfr = $scope.rfr;
        $scope.situation.ressourcesYearMoins2Captured = true;
        SituationService.save($scope.situation).then(function() {
            $state.go('foyer.simulation', { 'situationId': $scope.situation._id });
        });
    };
});
