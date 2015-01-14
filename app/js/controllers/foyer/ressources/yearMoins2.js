'use strict';

angular.module('ddsApp').controller('FoyerRessourceYearMoins2Ctrl', function($scope, $state, categoriesRnc, IndividuService) {
    $scope.yearMoins2 = moment().subtract('years', 2).format('YYYY');

    var parents = IndividuService.getParents($scope.situation.individus);
    $scope.individuRefs = [];
    parents.forEach(function(parent) {
        var individuRef = {
            individu: parent,
            label: IndividuService.label(parent),
            rnc: []
        };
        categoriesRnc.forEach(function(categorieRnc) {
            var ressource = _.find(parent.ressources, { type: categorieRnc.id });
            var montant = ressource ? ressource.montant : 0;
            individuRef.rnc.push({ categorie: categorieRnc, montant: montant });
        });
        $scope.individuRefs.push(individuRef);
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

        $scope.$emit('rnc');
    };
});
