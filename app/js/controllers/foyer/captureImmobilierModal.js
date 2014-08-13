'use strict';

angular.module('ddsApp').controller('FoyerCaptureImmobilierModalCtrl', function($scope, $modalInstance, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    if (!$scope.situation.mobilierValue) {
        $scope.situation.mobilierValue = 0;
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

    $scope.submit = function() {
        $scope.situation.immobilierCaptured = true;
        $modalInstance.close();
    };
});
