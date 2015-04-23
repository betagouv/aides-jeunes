'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, $stateParams, ressourceCategories, ressourceTypes, $state) {
    $scope.ressourceCategories = ressourceCategories;
    $scope.individuVM = $scope.individusVM[$stateParams.individu];
    var filteredRessourceTypes = _.filter(ressourceTypes, function(ressourceType) {
        return !_.contains(['pensionsAlimentairesVersees'], ressourceType.id);
    });
    $scope.ressourceTypesByCategories = _.groupBy(filteredRessourceTypes, 'category');

    var pageTitle = function() {
        switch ($scope.individuVM.individu.role) {
            case 'demandeur':
                return 'Vos ressources';
            case 'conjoint':
                return 'Les ressources de votre conjoint';
            default:
                return 'Les ressources de ' + $scope.individuVM.individu.firstName;
        }
    };
    $scope.pageTitle = pageTitle();

    var applySelectedRessources = function() {
        var currentRessources = $scope.individuVM.ressources;
        $scope.individuVM.ressources = [];
        ressourceTypes.forEach(function(ressourceType) {
            if (!$scope.individuVM.selectedRessourceTypes[ressourceType.id]) {
                return;
            }
            var ressource = _.find(currentRessources, { type: ressourceType });
            if (!ressource) {
                ressource = {
                    type: ressourceType,
                    montantAnnuel: 0
                };

                if ('caMicroEntreprise' === ressourceType.id) {
                    ressource.tnsActiviteType = 'bic';
                } else if ('caAutoEntrepreneur' === ressourceType.id) {
                    ressource.tnsActiviteType = 'bic';
                    ressource.montantsMensuels = [0, 0, 0];
                } else if ('tns' !== ressourceType.category) {
                    ressource.montantsMensuels = [0, 0, 0];
                    ressource.onGoing = true;
                }
            }
            $scope.individuVM.ressources.push(ressource);
        });
    };

    $scope.submit = function() {
        applySelectedRessources();
        $state.go('foyer.ressources');
    };
});
