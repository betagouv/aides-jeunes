'use strict';

angular.module('ddsApp').controller('FoyerCaptureImmobilierModalCtrl', function($scope, $modalInstance, situation, SituationService) {
    $scope.situation = situation;

    var conjointLabels = {
        'mariage': 'conjoint',
        'pacs': 'partenaire PACS',
        'relation_libre': 'concubin',
    };

    $scope.debutPeriode = moment().startOf('month').subtract('years', 1).format('MMMM YYYY');
    $scope.finPeriode = moment().startOf('month').subtract('months', 1).format('MMMM YYYY');
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

    $scope.situation.hasImmobilier = false;
    $scope.situation.valeurLocativeImmoNonLoue = 0;
    $scope.situation.valeurLocativeTerrainNonLoue = 0;
    $scope.situation.hasMobilier = false;
    $scope.situation.mobilierValueLivret = 0;
    $scope.situation.epargneSansRevenus = 0;

    $scope.conjointLabel = function() {
        return conjointLabels[$scope.situation.conjoint.relationType];
    };

    $scope.updateRevenusLocatifsYearAmount = function() {
        var montants = _.map($scope.revenusLocatifs.months, function(month) {
            return month.montant;
        });
        $scope.revenusLocatifs.year = Math.round(4 * _.reduce(montants, function(sum, num) {
            return sum + num;
        }));
    };

    $scope.submit = function(form) {
        $scope.situation.immobilierCaptured = true;
        $modalInstance.close();
    };
});
