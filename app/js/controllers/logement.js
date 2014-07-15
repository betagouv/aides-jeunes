'use strict';

angular.module('ddsApp').controller('LogementCtrl', function($scope, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    if (!$scope.situation.logement) {
        $scope.situation.logement = {};
    }
    $scope.logementTypes = SituationService.logementTypes;
});
