'use strict';

angular.module('ddsRecapSituation').controller('SimulationCtrl', function($scope, $stateParams,  SituationService) {
    $scope.situation = SituationService.restoreFromRemote($stateParams.situationId);
});
