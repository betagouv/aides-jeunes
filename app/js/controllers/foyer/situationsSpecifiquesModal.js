'use strict';

angular.module('ddsApp').controller('FoyerSituationsSpecifiquesModalCtrl', function($scope, $modalInstance, SituationService) {
    var statuts = SituationService.statutsSpecifiquesLabels;
    var situation = SituationService.restoreLocal();
    $scope.individus = SituationService.createIndividusList(situation);

    $scope.selectedSituations = {};
    _.forEach($scope.individus, function(individu) {
        _.forEach(statuts, function(situation, k) {
            if (individu.individu[k]) {
                $scope.selectedSituations[k] = true;
            }
        });
    });

    // création d'un array avec deux situations par ligne
    $scope.situations = [];
    var i = 0;
    var arr;
    _.forEach(statuts, function(statut, key) {
        if (i % 2 === 0) {
            arr = {};
            $scope.situations.push(arr);
        }
        arr[key] = statut;
        i++;
    });

    $scope.submit = function() {
        situation.situationsSpecifiquesCaptured = true;
        $modalInstance.close();
    };
});
