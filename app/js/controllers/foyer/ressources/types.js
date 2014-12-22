'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, $state, $stateParams, ressourceTypes) {

    var syncRessources = function(individuRef) {
        var previousRessources = individuRef.ressources;
        individuRef.ressources = [];

        ressourceTypes.forEach(function(ressourceType) {
            if (!individuRef.selectedRessourceTypes[ressourceType.id]) {
                return;
            }

            var ressource = _.find(previousRessources, { type: ressourceType });
            if (!ressource) {
                ressource = { type: ressourceType, interrupted: false };
                if ('caMicroEntreprise' === ressourceType.id) {
                    ressource.tnsStructureType = 'auto_entrepreneur';
                    ressource.tnsActiviteType = 'bic';
                }
                ressource.montantAnnuel = 0;

                if ('tns' !== ressourceType.category) {
                    ressource.months = [
                        { periode: $scope.months[0].id, montant: 0 },
                        { periode: $scope.months[1].id, montant: 0 },
                        { periode: $scope.months[2].id, montant: 0 }
                    ];
                }
            }
            individuRef.ressources.push(ressource);
        });
    };

    $scope.individuRef = $scope.individuRefs[$stateParams.individu];
    $scope.selectedRessourceTypes = $scope.individuRef.selectedRessourceTypes;

    var pageTitle = function() {
        switch ($scope.individuRef.individu.role) {
            case 'demandeur': return 'Vos ressources';
            case 'conjoint': return 'Les ressources de votre conjoint';
            default: return 'Les ressources de ' + $scope.individuRef.individu.firstName;
        }
    };
    $scope.pageTitle = pageTitle();

    $scope.submit = function() {
        syncRessources($scope.individuRef);
        $state.go('foyer.ressources');
    };
});
