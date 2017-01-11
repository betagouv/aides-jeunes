'use strict';

angular.module('ddsApp').controller('BodyCtrl', function($scope, $localStorage, $timeout, SituationService) {
    $scope.newSituation = function() {
        SituationService.newSituation();
    };
});
