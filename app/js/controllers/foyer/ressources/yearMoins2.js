'use strict';

angular.module('ddsApp').controller('FoyerRessourceYearMoins2Ctrl', function($scope, $state, categoriesRnc, IndividuService, SituationService) {
    $scope.yearMoins2 = moment().subtract('years', 2).format('YYYY');

    var parents = IndividuService.getParents($scope.situation.individus);
    $scope.individuRefs = [];
    parents.forEach(function(parent) {
        var individuRef = {
            individu: parent,
            label: IndividuService.label(parent),
            rnc: []
        };
        $scope.individuRefs.push(individuRef);
        categoriesRnc.forEach(function(categorieRnc) {
            individuRef.rnc.push({ categorie: categorieRnc, montant: 0 });
        });
    });

    $scope.submit = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            individuRef.rnc.forEach(function(rnc) {
                if (rnc.montant > 0) {
                    individuRef.individu.ressources.push({
                        periode: $scope.yearMoins2,
                        type: rnc.categorie.id,
                        montant: rnc.montant
                    });
                }
            });
        });

        SituationService.save($scope.situation).then(function() {
            $state.go('foyer.simulation', { 'situationId': $scope.situation._id });
        });
    };
});
