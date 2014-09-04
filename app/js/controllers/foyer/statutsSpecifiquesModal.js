'use strict';

angular.module('ddsApp').controller('FoyerStatutsSpecifiquesModalCtrl', function($scope, $modalInstance, statutsSpecifiques, SituationService) {
    var situation = SituationService.restoreLocal();
    $scope.individus = SituationService.createIndividusList(situation);
    $scope.individuLabel = SituationService.individuLabel;

    // pré initialisation des statuts sélectionnés si on a déjà rempli les statuts avant
    $scope.openedSituations = {};
    $scope.individus.forEach(function(individu) {
        statutsSpecifiques.forEach(function(statut) {
            if (individu[statut.id]) {
                $scope.openedSituations[statut.id] = true;
            }
        });
    });

    // création d'un array spécial pour afficher deux statuts par ligne
    $scope.statuts = [];
    var i = 0;
    var arr;
    statutsSpecifiques.forEach(function(statut) {
        if (i % 2 === 0) {
            arr = [];
            $scope.statuts.push(arr);
        }
        arr.push(statut);
        i++;
    });

    $scope.submit = function() {
        situation.statutsSpecifiquesCaptured = true;
        $modalInstance.close();
    };
});
