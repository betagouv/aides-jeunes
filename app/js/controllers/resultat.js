'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $window, $http, $state, $stateParams, $timeout, SimulationService, situation) {
    $scope.awaitingResults = true;
    $scope.situation = situation;

    var doDownloadCerfa = function(cerfa) {
        $window.open('/api/situations/' + situation._id + '/cerfa/' + cerfa, '_blank');
    };

    if ($stateParams.requestedCerfa) {
        doDownloadCerfa($stateParams.requestedCerfa);
    }

    SimulationService.simulate(situation).then(function(droits) {
        $scope.droits = droits;
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });

    $scope.downloadCerfa = function(cerfa) {
        if (situation.logement.adresse) {
            doDownloadCerfa(cerfa.id);
        } else {
            $state.go('form_infos_complementaires_individus', {requestedCerfa: cerfa.id});
        }
    };

    $scope.createTest = function() {
        $window.location.href = '/acceptance-tests/new/' + situation._id;
    };
});
