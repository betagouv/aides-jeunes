'use strict';

angular.module('ddsApp').controller('BodyCtrl', function($scope, $localStorage, $timeout, SituationService, BroadcastService) {
    $scope.showIntro = false;

    if (false !== $localStorage.showIntro) {
        $timeout(function() {
            $scope.showIntro = true;
        }, 500);
    }

    $scope.hideIntro = function() {
        $scope.showIntro = false;
        $localStorage.showIntro = false;
    };

    BroadcastService.getNewBroadcasts().then(function(newBroadcasts) {
        $scope.newBroadcasts = newBroadcasts;
    });

    $scope.markBroadcastsAsRead = BroadcastService.markBroadcastsAsRead;

    $scope.newSituation = function() {
        SituationService.newSituation();
    };
});
