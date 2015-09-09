'use strict';

angular.module('ddsRecapSituation').controller('ResultatCtrl', function($scope, $stateParams, SituationService) {
    $scope.situation = SituationService.restoreFromRemote($stateParams.situationId);
});
