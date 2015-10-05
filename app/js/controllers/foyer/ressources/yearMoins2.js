'use strict';

angular.module('ddsApp').controller('FoyerRessourceYearMoins2Ctrl', function($scope, $state, categoriesRnc, IndividuService) {
    var today = $scope.situation.dateDeValeur;
    $scope.yearMoins2 = moment(today).subtract('years', 2).format('YYYY');
    $scope.debutAnneeGlissante = moment(today).subtract('years', 1).format('MMMM YYYY');

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
            var montant = ressource ? ressource.montant : undefined;
            individuRef.rnc.push({ categorie: categorieRnc, montant: montant});
        });
        $scope.individuRefs.push(individuRef);
    });

    $scope.getDefaultValue = function(individuRef, rncID) {
        var mapping = {
            rncRevenusActivite: 'revenusSalarie',
            rncPensionsRetraitesRentes: 'pensionsRetraitesRentes',
            rncAutresRevenus: 'allocationsChomage'
        };
        individuRef.individu.ressourcesYearlyApproximation = individuRef.individu.ressourcesYearlyApproximation || {};
        return individuRef.individu.ressourcesYearlyApproximation[mapping[rncID]];
    };

    $scope.submit = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            // clean anciennes valeurs
            individuRef.individu.ressources = _.filter(individuRef.individu.ressources, function(ressource) {
                return ! _.find(categoriesRnc, { id: ressource.type });
            });

            // Remove from rnc the values that are not modified by the user
            individuRef.rnc = _.filter(individuRef.rnc, function(rnc) {
                return rnc.montant;
            });

            if (! _.isEmpty(individuRef.rnc)) {
                $scope.situation.ressourcesYearMoins2Captured = true;
            }

            individuRef.rnc.forEach(function(rnc) {
                individuRef.individu.ressources.push({
                    periode: $scope.yearMoins2,
                    type: rnc.categorie.id,
                    montant: rnc.montant
                });
            });
        });

        $scope.$emit('rnc');
    };
});
