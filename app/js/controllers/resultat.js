'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, $rootScope, $window, $http, $state, $stateParams, $timeout, SituationService, ResultatService, cerfaForms) {
    $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract('years', 2).format('YYYY');
    $scope.debutPeriode = moment($scope.situation.dateDeValeur).startOf('month').subtract('years', 1).format('MMMM YYYY');
    $scope.finPeriode = moment($scope.situation.dateDeValeur).startOf('month').subtract('months', 1).format('MMMM YYYY');
    $scope.awaitingResults = true;

    $scope.error = false;
    $scope.droits = null;
    $scope.droitsNonEligibles = null;

    $scope.ressourcesYearMoins2Captured = SituationService.ressourcesYearMoins2Captured($scope.situation);

    ResultatService.simulate($scope.situation).then(function(droits) {
        $scope.droits = droits.droitsEligibles;
        $scope.droitsInjectes = droits.droitsInjectes;
        $scope.droitsNonEligibles = droits.droitsNonEligibles;
        $scope.noDroits = _.isEmpty($scope.droits);
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

    $scope.round = function(droit) {
        if (! droit.unit && droit.roundToNearest10 !== false) {
            return Math.round(droit.montant / 10) * 10;
        } else {
            return Math.round(droit.montant);
        }
    };

    $scope.hasCerfa = function(droit) { return cerfaForms[droit]; };

    $scope.goToCerfa = function(droit) {
        $state.go('foyer.download_cerfa', { droit: droit });
    };

    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
});
