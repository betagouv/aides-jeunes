'use strict';

angular.module('ddsApp').controller('SimulationCtrl', function($scope, $rootScope, $window, $http, $state, $stateParams, $timeout, SituationService, SimulationService, CerfaService) {
    $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract('years', 2).format('YYYY');
    $scope.debutPeriode = moment($scope.situation.dateDeValeur).startOf('month').subtract('years', 1).format('MMMM YYYY');
    $scope.finPeriode = moment($scope.situation.dateDeValeur).startOf('month').subtract('months', 1).format('MMMM YYYY');
    $scope.awaitingResults = true;

    $scope.error = false;
    $scope.droits = null;
    $scope.droitsNonEligibles = null;

    SimulationService.simulate($scope.situation).then(function(result) {
        $scope.droits = result.droits;
        $scope.droitsNonEligibles = result.droitsNonEligibles;
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });

    $scope.createTest = function() {
        var expectedResults = _.map($scope.droits, function(droit) {
            return {
                code: droit.description.id,
                expectedValue: droit.montant ? droit.montant : true
            };
        });

        $http.post('api/acceptance-tests', {
            expectedResults: expectedResults,
            scenario: { situationId: $scope.situation._id }
        }).success(function(data) {
            $window.location.href = '/tests/' + data._id + '/edit';
        }).error(function(data) {
            $window.alert(data);
        });
    };

    $scope.round = function(montant) {
        return Math.round(montant / 10) * 10;
    };

    $scope.hasDroitForms = function(droit) {
        return CerfaService.hasDroitForms(droit.description);
    };
});
