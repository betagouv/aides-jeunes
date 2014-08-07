'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $window, $http, $state, SimulationService, situation) {
    $scope.awaitingResults = true;
    SimulationService.simulate(situation).then(function(droits) {
        $scope.droits = droits;
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });

    $scope.downloadCerfa = function(cerfa) {
        if (situation.logement.adresse) {
            $window.open('/api/situations/' + situation._id + '/cerfa/' + cerfa.id, '_blank');
        } else {
            $state.go('form_infos_complementaires_noms_prenoms');
        }
    };

    $scope.createTest = function() {
        $window.location.href = '/acceptance-tests/new/' + situation._id;
    };
});
