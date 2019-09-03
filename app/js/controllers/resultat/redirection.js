'use strict';

angular.module('ddsApp').controller('RedirectionCtrl', function($scope, $stateParams, SituationService, TrampolineService) {
    var trampoline = TrampolineService.get();
    if (trampoline && trampoline.situationId) {
        SituationService.saveLocal({ _id: trampoline.situationId });
    }
    $scope.situation = SituationService.restoreLocal();
    if (! $scope.situation._id) {
        return;
    }

    SituationService.fetchRepresentation($scope.situation._id, $stateParams.vers)
        .then(function(data) {
            $scope.teleservice = data;
        }).catch(function(error) {
            $scope.error = JSON.stringify(error, null, 2);
        });
});
