'use strict';

angular.module('ddsApp').controller('FoyerCaptureImmobilierModalCtrl', function($scope, $modalInstance, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    if (!$scope.situation.mobilierValue) {
        $scope.situation.mobilierValue = 0;
    }

    if (angular.isUndefined($scope.situation.hasImmobilier)) {
        $scope.situation.hasImmobilier = false;
    }

    $scope.conjointTitle = function() {
        if ($scope.situation.conjoint.relationType === 'mariage') {
            return 'conjoint';
        }

        if ($scope.situation.conjoint.relationType === 'pacs') {
            return 'partenaire PACS';
        }

        if ($scope.situation.conjoint.relationType === 'relation_libre') {
            return 'concubin';
        }
    };

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid) {
            $scope.situation.immobilierCaptured = true;
            $modalInstance.close();
        }
    };
});
