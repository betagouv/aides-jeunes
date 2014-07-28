'use strict';

angular.module('ddsApp').controller('FoyerCapturePatrimoineModalCtrl', function($scope, $rootScope, $modalInstance, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    $scope.submit = function() {
        $scope.situation.patrimoine.formCompleted = true;
        $modalInstance.close();
    };

    $scope.patrimoineMobilierOptions = SituationService.patrimoineMobilierOptions;
    $scope.patrimoineImmobilierOptions = SituationService.patrimoineImmobilierOptions;

    if (!$scope.situation.patrimoine) {
        $scope.situation.patrimoine = {
            mobilier: $scope.patrimoineMobilierOptions[0],
            immobilier: $scope.patrimoineImmobilierOptions[0]
        };
    }
});
