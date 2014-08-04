'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $window, $http, SimulationService, SituationService, situation) {
    $scope.awaitingResults = true;
    SimulationService.simulate(situation).then(function(droits) {
        $scope.droits = droits;
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.situationId = situation._id;
        $scope.awaitingResults = false;
    });

    $scope.createTest = function() {
        $window.location.href = '/acceptance-tests/new/' + situation._id;
    };
});
