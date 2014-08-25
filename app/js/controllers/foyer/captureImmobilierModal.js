'use strict';

angular.module('ddsApp').controller('FoyerCaptureImmobilierModalCtrl', function($scope, $modalInstance, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    if (!$scope.situation.mobilierValue) {
        $scope.situation.mobilierValue = 0;
    }

    if (angular.isUndefined($scope.situation.hasImmobilier)) {
        $scope.situation.hasImmobilier = false;
    }

    var conjointLabels = {
        'mariage': 'conjoint',
        'pacs': 'partenaire PACS',
        'relation_libre': 'concubin',
    };

    $scope.conjointLabel = function() {
        return conjointLabels[$scope.situation.conjoint.relationType];
    };

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid) {
            $scope.situation.immobilierCaptured = true;
            $modalInstance.close();
        }
    };
});
