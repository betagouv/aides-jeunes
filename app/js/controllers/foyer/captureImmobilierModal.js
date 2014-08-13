'use strict';

angular.module('ddsApp').controller('FoyerCaptureImmobilierModalCtrl', function($scope, $modalInstance, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    if (!$scope.situation.mobilierValue) {
        $scope.situation.mobilierValue = 0;
    }

    $scope.conjointTitle = 

    $scope.submit = function() {
        $scope.situation.immobilierCaptured = true;
        $modalInstance.close();
    };
});
