'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $window, $http, $state, $stateParams, $timeout, SimulationService, situation) {
    $scope.awaitingResults = true;
    $scope.situation = situation;

    SimulationService.simulate(situation).then(function(droits) {
        $scope.droits = droits;
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });

    $scope.arrondi = function(montant) {
        return Math.floor(montant / 10) * 10;
    };

    $scope.downloadCerfa = function(cerfa) {
        if (situation.infosComplementairesCaptured) {
            $state.go('download_cerfa', {cerfa: cerfa.id});
        } else {
            $state.go('form_infos_complementaires_individus', {requestedCerfa: cerfa.id});
        }
    };

    $scope.createTest = function() {
        $window.location.href = '/acceptance-tests/new/' + situation._id;
    };
});
