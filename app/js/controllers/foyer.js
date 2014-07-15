'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $location, $modal, $state, $timeout, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.saveSituation = function() {
        SituationService.saveLocal($scope.situation);
        SituationService.saveRemote($scope.situation);
    };

    $scope.statutsSpecifiques = function(individu) {
        return SituationService.formatStatutsSpecifiques(individu);
    };
});
