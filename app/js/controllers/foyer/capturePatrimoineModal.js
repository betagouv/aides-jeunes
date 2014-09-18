'use strict';

angular.module('ddsApp').controller('FoyerCapturePatrimoineModalCtrl', function($scope, $modalInstance, situation, SituationService) {
    var debutPeriode = moment().startOf('month').subtract('years', 1);
    $scope.debutPeriode = debutPeriode.format('MMMM YYYY');
    var finPeriode = moment().startOf('month').subtract('months', 1);
    $scope.finPeriode = finPeriode.format('MMMM YYYY');
    $scope.months = SituationService.getMonths();

    $scope.revenusLocatifs = {
        months: [
            {montant: 0},
            {montant: 0},
            {montant: 0}
        ],
        year: 0
    };

    $scope.revenusDuCapital = {
        months: [
            {montant: 0},
            {montant: 0},
            {montant: 0}
        ],
        year: 0
    };

    $scope.patrimoine = situation.patrimoine;
    if (!$scope.patrimoine) {
        $scope.patrimoine = situation.patrimoine = {};
        $scope.patrimoine.hasImmobilier = false;
        $scope.patrimoine.valeurLocativeImmoNonLoue = 0;
        $scope.patrimoine.valeurLocativeTerrainNonLoue = 0;
        $scope.patrimoine.hasMobilier = false;
        $scope.patrimoine.epargneSurLivret = 0;
        $scope.patrimoine.epargneSansRevenus = 0;
    } else {
        $scope.patrimoine.hasImmobilier = 0 < ($scope.patrimoine.valeurLocativeImmoNonLoue + $scope.patrimoine.valeurLocativeTerrainNonLoue);
        $scope.patrimoine.hasMobilier = 0 < $scope.patrimoine.epargneSansRevenus;
    }

    $scope.updateRevenusLocatifsYearAmount = function() {
        var montants = _.map($scope.revenusLocatifs.months, function(month) {
            return month.montant;
        });
        $scope.revenusLocatifs.year = Math.round(4 * _.reduce(montants, function(sum, num) {
            return sum + num;
        }));
    };

    $scope.updateRevenusDuCapitalYearAmount = function() {
        var montants = _.map($scope.revenusDuCapital.months, function(month) {
            return month.montant;
        });
        $scope.revenusDuCapital.year = Math.round(4 * _.reduce(montants, function(sum, num) {
            return sum + num;
        }));
    };

    $scope.submit = function() {
        situation.patrimoineCaptured = true;

        $scope.patrimoine.revenusLocatifs = [];
        if ($scope.patrimoine.hasImmobilier) {
            [0, 1, 2].forEach(function(index) {
                $scope.patrimoine.revenusLocatifs.push({
                    periode: $scope.months[index].id,
                    montant: $scope.revenusLocatifs.months[index].montant
                });
            });

            $scope.patrimoine.revenusLocatifs.push({
                debutPeriode: debutPeriode.format('YYYY-MM'),
                finPeriode: finPeriode.format('YYYY-MM'),
                montant: $scope.revenusLocatifs.year
            });
        }

        $scope.patrimoine.revenusDuCapital = [];
        if ($scope.patrimoine.hasMobilier) {
            [0, 1, 2].forEach(function(index) {
                $scope.patrimoine.revenusDuCapital.push({
                    periode: $scope.months[index].id,
                    montant: $scope.revenusDuCapital.months[index].montant
                });
            });

            $scope.patrimoine.revenusDuCapital.push({
                debutPeriode: debutPeriode.format('YYYY-MM'),
                finPeriode: finPeriode.format('YYYY-MM'),
                montant: $scope.revenusDuCapital.year
            });
        }

        $modalInstance.close();
    };
});
