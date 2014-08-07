'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesAddressCtrl', function($scope, $state, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    $scope.submit = function(form) {
        if (form.$invalid) {
            $scope.error = true;
        } else {
            SituationService.update($scope.situation).then(function() {
                $state.go('resultat', {'situationId': $scope.situation._id});
            });
        }
    };
});
