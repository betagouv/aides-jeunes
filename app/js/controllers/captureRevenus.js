'use strict';

angular.module('ddsApp').controller('CaptureRevenusCtrl', function($scope, $timeout, $modal, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.relationTypeLabels = SituationService.relationTypeLabels;
    $scope.nationaliteLabels = SituationService.nationaliteLabels;
    $timeout(function() {
        $scope.triggerShadow = true;
    }, 700);

    $timeout(function() {
        $modal.open({
            templateUrl: '/partials/capture-revenus-modal.html',
            controller: 'CaptureRevenusModalCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                modalTitle: function() {
                    return 'Vos revenus et aides';
                }
            }
        });
    }, 2500);
});
