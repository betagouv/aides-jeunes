'use strict';

angular.module('ddsApp').controller('SimulationCtrl', function($scope, $rootScope, $window, $http, $state, $stateParams, $timeout, SituationService, SimulationService, CerfaService) {
    $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract('years', 2).format('YYYY');
    $scope.debutPeriode = moment($scope.situation.dateDeValeur).startOf('month').subtract('years', 1).format('MMMM YYYY');
    $scope.finPeriode = moment($scope.situation.dateDeValeur).startOf('month').subtract('months', 1).format('MMMM YYYY');
    $scope.awaitingResults = true;

    $scope.error = false;
    $scope.droits = null;
    $scope.droitsNonEligibles = null;

    SimulationService.simulate($scope.situation).then(function(droits) {
        $scope.droits = droits;
        $scope.droitsNonEligibles = SimulationService.complement(droits);
        $scope.noDroits = _.isEmpty(droits);
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });

    $scope.createTest = function() {
        var expectedResults = _.map($scope.droits, function(droit, id) {
            return {
                code: id,
                expectedValue: droit.montant
            };
        });

        $http.post('api/public/acceptance-tests', {
            expectedResults: expectedResults,
            scenario: { situationId: $scope.situation._id }
        }).success(function(data) {
            $window.location.href = '/tests/' + data._id + '/edit';
        }).error(function(data) {
            $window.alert(data.error.apiError);
        });
    };

    $scope.round = function(montant) {
        return Math.round(montant / 10) * 10;
    };

    $scope.hasCerfa = CerfaService.getCerfaFromDroit;

    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
});
