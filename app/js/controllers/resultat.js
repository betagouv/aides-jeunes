'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, SimulationService) {
    $scope.awaitingResults = true;
    SimulationService.simulate().then(function(droits) {
        $scope.droits = droits;
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });
});
