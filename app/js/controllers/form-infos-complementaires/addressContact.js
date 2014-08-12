'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesAddressContactCtrl', function($scope, $state, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    $scope.submit = function() {
        SituationService.update($scope.situation).then(function() {
            $state.go('resultat', {'situationId': $scope.situation._id});
        });
    };
});
