'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesAddressContactCtrl', function($scope, $state, $stateParams, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    $scope.submit = function() {
        $state.go('form_infos_complementaires_situation_pro', {requestedCerfa: $stateParams.requestedCerfa});
    };
});
