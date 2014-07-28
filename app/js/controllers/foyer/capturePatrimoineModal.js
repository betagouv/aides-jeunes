'use strict';

angular.module('ddsApp').controller('FoyerCapturePatrimoineModalCtrl', function($scope, $rootScope, $modalInstance, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.situation.patrimoine = {};
    $scope.situation.patrimoine.mobilier = 0;
    $scope.situation.patrimoine.immobilier = 0;

    $scope.submit = function() {
        $scope.situation.patrimoine.formCompleted = true;
        $modalInstance.close();
    };

    $scope.patrimoineMobilierOptions = SituationService.patrimoineMobilierOptions;
    $scope.patrimoineImmobilierOptions = SituationService.patrimoineImmobilierOptions;
});
