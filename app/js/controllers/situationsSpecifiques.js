'use strict';

angular.module('ddsApp').controller('SituationsSpecifiquesCtrl', function($scope, SituationService) {
    $scope.situations = SituationService.statutsSpecifiquesLabels;
    var situation = SituationService.restoreLocal();
    $scope.individus = SituationService.createIndividusList(situation);

    $scope.selectedSituations = {};
    _.forEach($scope.individus, function(individu) {
        _.forEach($scope.situations, function(situation, k) {
            if (individu.individu[k]) {
                $scope.selectedSituations[k] = true;
            }
        });
    });

    $scope.done = function() {
        situation.situationsSpecifiquesCaptured = true;
    };
});
