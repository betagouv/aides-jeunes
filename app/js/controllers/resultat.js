'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $window, $http, SimulationService, SituationService) {
    var situation = SituationService.restoreLocal();
    $scope.awaitingResults = true;
    SimulationService.simulate().then(function(droits) {
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
