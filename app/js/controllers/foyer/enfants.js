'use strict';

angular.module('ddsApp').controller('FoyerEnfantsCtrl', function($scope, $rootScope, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.nationaliteLabels = SituationService.nationaliteLabels;

    if (!$scope.situation.enfants) {
        $scope.situation.enfants = [];
    }

    if (!!$scope.situation.conjoint || null === $scope.situation.conjoint) {
        $scope.visible = true;
    }

    $rootScope.$on('individu.conjoint', function(e, conjoint) {
        $scope.visible = true;
    });

    $scope.removeChild = function(child) {
        var index = $scope.situation.enfants.indexOf(child);
        $scope.situation.enfants.splice(index, 1);
        if (0 === $scope.situation.enfants.length) {
            $scope.situation.hasChildren = undefined;
        }
    };

    $scope.endChildConfig = function() {
        $scope.situation.childConfigDone = true;
        $scope.$emit('enfants', $scope.situation.enfants);
        if ($scope.situation.enfants.length === 0) {
            $scope.situation.hasChildren = false;
        }
    };
});
