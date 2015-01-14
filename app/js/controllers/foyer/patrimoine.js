'use strict';

angular.module('ddsApp').controller('FoyerPatrimoineCtrl', function($scope, SituationService) {
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

    $scope.patrimoine = {
        hasImmobilier: false,
        valeurLocativeImmoNonLoue: 0,
        valeurLocativeTerrainNonLoue: 0,
        hasMobilier: false,
        epargneSurLivret: 0,
        epargneSansRevenus: 0
    };

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

        $scope.patrimoine.captured = true;
        $scope.$emit('patrimoine', $scope.patrimoine);
    };
});
