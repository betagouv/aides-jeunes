'use strict';

angular.module('ddsApp').controller('SituationsSpecifiquesCtrl', function($scope, SituationService) {
    $scope.situations = SituationService.statutsSpecifiquesLabels;
    $scope.displaySituation = function(situation) {
        return situation.charAt(0).toUpperCase() + situation.substring(1);
    };

    var situation = SituationService.restoreLocal();
    $scope.individus = SituationService.createIndividusList(situation);

    $scope.selectedSituations = {};
    for (var i in $scope.individus) {
        var individu = $scope.individus[i].individu;
        for (var j in $scope.situations) {
            if (individu[j]) {
                $scope.selectedSituations[j] = true;
            }
        }
    }
});
