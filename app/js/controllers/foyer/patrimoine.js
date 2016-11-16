'use strict';

angular.module('ddsApp').controller('FoyerPatrimoineCtrl', function($scope, SituationService, RessourceService) {
    $scope.patrimoine = $scope.situation.patrimoine || {
        valeurLocativeImmoNonLoue: 0,
        valeurLocativeTerrainNonLoue: 0,
        epargneSurLivret: 0,
        epargneSansRevenus: 0
    };

    $scope.submit = function(form) {
        if (! form.$valid)
            return document.querySelector('input[aria-invalid="true"]').focus();
        $scope.patrimoine.captured = true;
        $scope.$emit('patrimoine', $scope.patrimoine);
    };
});
