'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $location, $modal, $state, $timeout, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.saveSituation = function() {
        SituationService.saveLocal($scope.situation);
        SituationService.saveRemote($scope.situation);
    };

    $scope.$on('animateCaptureRevenusStart', function() {
        $scope.animate = true;
    });

    $scope.$on('animateCaptureRevenusEnd', function() {
        $scope.animate = false;
    });
});
