'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesAdresseContactCtrl', function($scope, $state, $stateParams, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    $scope.submit = function() {
        SituationService.update($scope.situation).then(function() {
            $scope.situation.infosComplementairesCaptured = true;
            $state.go('download_cerfa', {droit: $stateParams.droit});
        });
    };
});
