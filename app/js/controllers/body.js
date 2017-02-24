'use strict';

angular.module('ddsApp').controller('BodyCtrl', function($scope, $timeout, SituationService) {
    $scope.newSituation = function() {
        SituationService.newSituation();
    };

    $scope.loading = false;
    var pendingChanges = 0;
    var changingState = false;
    var stateChangeStart = function() {
        pendingChanges++;
        $timeout(function() {
            if (0 < pendingChanges) {
                $scope.loading = true;
            }
        }, 100);
    };
    $scope.$on('$stateChangeStart', function() {
        if (! changingState) {
            changingState = true;
            stateChangeStart();
        }
    });

    var stateChangeEnd = function() {
        pendingChanges--;
        if (0 === pendingChanges) {
            $scope.loading = false;
        }
    };

    $scope.$on('$stateChangeSuccess', function() {
        changingState = false;
        stateChangeEnd();
    });
    $scope.$on('$stateChangeError', function() {
        changingState = false;
        stateChangeEnd();
    });
});
