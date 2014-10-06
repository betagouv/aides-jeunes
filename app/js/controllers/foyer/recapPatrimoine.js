'use strict';

angular.module('ddsApp').controller('FoyerRecapPatrimoineCtrl', function($scope, $rootScope, $timeout, $location, $anchorScroll) {
    var hasRevenusLocatifs = function(patrimoine) {
        var sommeRevenusLocatifs = 0;
        patrimoine.revenusLocatifs.forEach(function(revenu) {
            sommeRevenusLocatifs += revenu.montant;
        });

        return 0 < sommeRevenusLocatifs;
    };

    var hasImmobilier = function(patrimoine) {
        if (patrimoine.valeurLocativeImmoNonLoue || patrimoine.valeurLocativeTerrainNonLoue) {
            return true;
        }

        return hasRevenusLocatifs(patrimoine);
    };

    var hasRevenusDuCapital = function(patrimoine) {
        var sommeRevenusDuCapital = 0;
        patrimoine.revenusDuCapital.forEach(function(revenu) {
            sommeRevenusDuCapital += revenu.montant;
        });

        return 0 < sommeRevenusDuCapital;
    };

    var hasMobilier = function(patrimoine) {
        if (patrimoine.epargneSansRevenus) {
            return true;
        }

        return hasRevenusDuCapital(patrimoine);
    };

    var refresh = function() {
        var patrimoine = $scope.situation.patrimoine;
        if (patrimoine) {
            $scope.hasImmobilier = hasImmobilier(patrimoine);
            $scope.hasMobilier = hasMobilier(patrimoine);
            $scope.hasRevenusLocatifs = hasRevenusLocatifs(patrimoine);
            $scope.hasRevenusDuCapital = hasRevenusDuCapital(patrimoine);
        }
    };

    refresh();

    $rootScope.$on('patrimoineCaptured', function() {
        refresh();
        $timeout(function() {
            $location.hash('recap-patrimoine');
            $anchorScroll();
        });
    });
});
