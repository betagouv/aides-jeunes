'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $rootScope, $window, $http, $state, $stateParams, $timeout, SimulationService, CerfaService, situation) {
    $scope.situation = situation;

    $scope.yearMoins2 = moment().subtract('years', 2).format('YYYY');
    $scope.debutPeriode = moment().startOf('month').subtract('years', 1).format('MMMM YYYY');
    $scope.finPeriode = moment().startOf('month').subtract('months', 1).format('MMMM YYYY');

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
        return _.contains(['als', 'alf', 'apl'], droit.description.id);
    };

    $scope.hasDroitAllocationLogement = function() {
        var result = false;
        $scope.droits.forEach(function(droit) {
            if ($scope.isDroitAllocationLogement(droit)) {
                result = true;
            }
        });

        return result;
    };

    $scope.isDroitCmuAcs = function(droit) {
        return _.contains(['cmu_c', 'acs'], droit.description.id);
    };

    $scope.hasDroitForms = function(droit) {
        return CerfaService.hasDroitForms(droit.description);
    };

    $scope.displayLogementWarning = function() {
        return _.every([
            !$scope.awaitingResults,
            !situation.ressourcesN2Captured,
            !$scope.hasDroitAllocationLogement(),
            'gratuit' !== situation.logement.type,
            !situation.logement.membreFamilleProprietaire,
            false !== situation.logement.primoAccedant
        ]);
    };

    $rootScope.$on('ressourcesCaptured', function(ressourcesN2) {
        if (ressourcesN2) {
            situation.ressourcesN2Captured = true;
            launchSimulation();
        }
    });
});
