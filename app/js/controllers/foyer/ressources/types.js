'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, $stateParams, ressourceCategories, SituationService, IndividuService,  ressourceTypes, $state) {

    $scope.individuIndex = parseInt($stateParams.individu);
    $scope.individuVM = $scope.individusVM[$stateParams.individu];
    $scope.pageTitle = $scope.getPageTitle($scope.individuVM);
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

    var applySelectedRessources = function() {
        var currentRessources = $scope.individuVM.ressources;
        $scope.individuVM.ressources = [];
        ressourceTypes.forEach(function(ressourceType) {
            if (! $scope.individuVM.selectedRessourceTypes[ressourceType.id]) {
                return;
            }
            var ressource = _.find(currentRessources, { type: ressourceType });
            if (! ressource) {
                ressource = _.cloneDeep(DEFAULT_RESOURCE);
                ressource.type = ressourceType;
            }
            $scope.individuVM.ressources.push(ressource);
        });
    };

    $scope.submit = function() {
        applySelectedRessources($scope.individuVM);
        if ($scope.individuVM.ressources.length) {
            $state.go('foyer.ressources.montants', { individu: $scope.individuIndex });
        } else {
            $scope.declareNextIndividuResources($scope.individuIndex);
        }
    };

    $scope.shouldInitiallyOpen = function(category) {
        var categoriesWithResourceDeclared = $scope.individuVM.ressources.map(function(ressource) {
            return ressource.type.category;
        });
        return categoriesWithResourceDeclared.indexOf(category.id) >= 0;
    };
});
