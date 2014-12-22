'use strict';

angular.module('ddsApp').controller('SimulationCtrl', function($scope, $rootScope, $window, $http, $state, $stateParams, $timeout, SituationService, SimulationService, CerfaService) {
    $scope.yearMoins2 = moment().subtract('years', 2).format('YYYY');
    $scope.debutPeriode = moment().startOf('month').subtract('years', 1).format('MMMM YYYY');
    $scope.finPeriode = moment().startOf('month').subtract('months', 1).format('MMMM YYYY');

    var launchSimulation = function() {
        $scope.awaitingResults = true;
        $scope.error = false;
        $scope.droits = null;
        $scope.droitsYearMoins2 = null;
        $scope.droitsNonEligibles = null;

        SimulationService.simulate($scope.situation).then(function(result) {
            $scope.droits = result.droits;
            $scope.droitsYearMoins2 = result.droitsYearMoins2;
            $scope.droitsNonEligibles = result.droitsNonEligibles;
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
        return CerfaService.getCerfaFormsFromDroit(droit, $scope.situation);
    };

    $scope.isDroitCmuAcs = function(droit) {
        return _.contains(['cmu_c', 'acs'], droit.description.id);
    };

    $scope.hasDroitForms = function(droit) {
        return CerfaService.hasDroitForms(droit.description);
    };

    $scope.createTest = function() {
        $window.location.href = '/acceptance-tests/new/' + $scope.situation._id;
    };
});
