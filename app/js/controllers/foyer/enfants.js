'use strict';

angular.module('ddsApp').controller('FoyerEnfantsCtrl', function($scope, $rootScope, $location, $anchorScroll, $timeout, SituationService) {
    $scope.nationaliteLabels = SituationService.nationaliteLabels;

    if (!$scope.situation.enfants) {
        $scope.situation.enfants = [];
    }

    if (angular.isDefined($scope.situation.conjoint)) {
        $scope.visible = true;
    }

    $rootScope.$on('individu.conjoint', function() {
        $scope.visible = true;
        $timeout(function() {
            $location.hash('panel-enfants');
            $anchorScroll();
        });
    });

    $rootScope.$on('individu.enfant', function(e, enfant) {
        $scope.situation.enfants.push(enfant);
    });

    $scope.removeChild = function(child) {
        var index = $scope.situation.enfants.indexOf(child);
        $scope.situation.enfants.splice(index, 1);
        if (!$scope.situation.enfants.length) {
            $scope.situation.hasChildren = undefined;
        }
    };

    $scope.endChildConfig = function() {
        $scope.situation.childConfigDone = true;
        $scope.$emit('enfants', $scope.situation.enfants);
        if (!$scope.situation.enfants.length) {
            $scope.situation.hasChildren = false;
        }
    };
});
