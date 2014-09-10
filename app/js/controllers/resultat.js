'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $window, $http, $state, $stateParams, $timeout, SimulationService, CerfaService, situation) {
    $scope.situation = situation;

    var launchSimulation = function() {
        $scope.awaitingResults = true;
        $scope.error = false;
        $scope.droits = null;

        SimulationService.simulate(situation).then(function(droits) {
            $scope.droits = droits;
        }, function() {
            $scope.error = true;
        }).finally(function() {
            $scope.awaitingResults = false;
        });
    };

    launchSimulation();

    $scope.round = function(montant) {
        return Math.floor(montant / 10) * 10;
    };

    $scope.cerfaForms = function(droit) {
        return CerfaService.getCerfaFormsFromDroit(droit, situation);
    };

    $scope.createTest = function() {
        $window.location.href = '/acceptance-tests/new/' + situation._id;
    };

    $scope.isDroitAllocationLogement = function(droit) {
        return _.contains(['als', 'alf', 'apl'], droit.id);
    };

    $scope.$on('ressourcesCaptured', function(ressourcesN2) {
        if (ressourcesN2) {
            situation.ressourcesN2Captured = true;
            launchSimulation();
        }
    });
});
