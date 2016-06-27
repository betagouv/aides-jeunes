'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, $stateParams, ressourceCategories, ressourceTypes, $state, RessourceService) {

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.ressourceCategories = ressourceCategories;
    var filteredRessourceTypes = _.filter(ressourceTypes, function(ressourceType) {
        return ! _.contains(['pensionsAlimentairesVersees'], ressourceType.id);
    });
    $scope.ressourceTypesByCategories = _.groupBy(filteredRessourceTypes, 'category');

    var DEFAULT_RESOURCE = {
        montantAnnuel: 0,
        caAnnuel: 0,
        montantsMensuels: [0, 0, 0],
        onGoing: true,
    };

    $scope.applySelectedRessources = function (selectedRessourceTypes) {
        var currentRessources = _.clone($scope.ressources);
        // $scope.ressources is referenced by parent controller, we need to keep the reference
        $scope.ressources.length = 0;
        ressourceTypes.forEach(function(ressourceType) {
            if (! selectedRessourceTypes[ressourceType.id]) {
                return;
            }
            var ressource = _.find(currentRessources, { type: ressourceType });
            if (! ressource) {
                ressource = _.cloneDeep(DEFAULT_RESOURCE);
                ressource.type = ressourceType;
            }
            $scope.ressources.push(ressource);
        });
    };

    $scope.submit = function() {
        $scope.applySelectedRessources($scope.selectedRessourceTypes);
        if (_.some($scope.selectedRessourceTypes)) {
            $state.go('foyer.ressources.individu.montants');
        } else {
            RessourceService.applyRessourcesToIndividu($scope.individu, $scope.ressources, $scope.situation.dateDeValeur);
            $scope.declareNextIndividuResources(parseInt($stateParams.individu));
        }
    };

    $scope.shouldInitiallyOpen = function(category) {
        var categoriesWithResourceDeclared = $scope.ressources.map(function(ressource) {
            return ressource.type.category;
        });
        return categoriesWithResourceDeclared.indexOf(category.id) >= 0;
    };
});
