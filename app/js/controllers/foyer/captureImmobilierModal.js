'use strict';

angular.module('ddsApp').controller('FoyerCaptureImmobilierModalCtrl', function($scope, $modalInstance, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    if (!$scope.situation.mobilierValue) {
        $scope.situation.mobilierValue = 0;
    }

    if (angular.isUndefined($scope.situation.hasImmobilier)) {
        $scope.situation.hasImmobilier = false;
    }

    var conjointTitles = {
        'mariage': 'conjoint',
        'pacs': 'partenaire PACS',
        'relation_libre': 'concubin',
    };

    $scope.conjointTitle = function() {
        return conjointTitles[$scope.situation.conjoint.relationType];
    };

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid) {
            $scope.situation.immobilierCaptured = true;
            $modalInstance.close();
        }
    };
});
