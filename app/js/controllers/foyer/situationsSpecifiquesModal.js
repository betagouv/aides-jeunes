'use strict';

angular.module('ddsApp').controller('FoyerSituationsSpecifiquesModalCtrl', function($scope, $modalInstance, SituationService) {
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

    $scope.submit = function() {
        situation.situationsSpecifiquesCaptured = true;
        $modalInstance.close();
    };
});
