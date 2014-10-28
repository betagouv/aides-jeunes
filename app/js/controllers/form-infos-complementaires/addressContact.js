'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesAddressContactCtrl', function($scope, $state, $stateParams, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    $scope.submit = function() {
        SituationService.update($scope.situation).then(function() {
            $scope.situation.infosComplementairesCaptured = true;
            $state.go('download_cerfa', {droit: $stateParams.droit});
        });

      // $state.go('form_infos_complementaires_situation_pro', {droit: $stateParams.droit});
    };
});
