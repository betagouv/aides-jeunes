'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $window, SimulationService, SituationService) {
    var situation = SituationService.restoreLocal();
    $scope.awaitingResults = true;
    SimulationService.simulate().then(function(simulation) {
        $scope.situationId = simulation.situationId;
        $scope.droits = simulation.droits;
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });

    $scope.createTest = function() {
        $window.location.href = '/acceptance-tests/new/' + situation._id;
    };
});
