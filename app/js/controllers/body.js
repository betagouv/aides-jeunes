'use strict';

angular.module('ddsApp').controller('BodyCtrl', function($scope, $timeout, SituationService) {
    $scope.newSituation = function() {
        SituationService.newSituation();
    };
});
