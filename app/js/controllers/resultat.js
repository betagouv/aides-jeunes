'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $window, $http, $state, $stateParams, $timeout, SimulationService, CerfaService, situation) {
    $scope.awaitingResults = true;
    $scope.situation = situation;

    SimulationService.simulate(situation).then(function(droits) {
        $scope.droits = droits;
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });

    $scope.round = function(montant) {
        return Math.floor(montant / 10) * 10;
    };

    $scope.cerfaForms = function(droit) {
        return CerfaService.getCerfaFormsFromDroit(droit, situation);
    };

    $scope.createTest = function() {
        $window.location.href = '/acceptance-tests/new/' + situation._id;
    };
});
