'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, ressourceCategories, ressourceTypes, $state) {

    function extractIndividuSelectedRessourceTypes (individu) {
        var result = {};
        var ressources = individu.ressources || [];
        _.chain(ressources)
            .pluck('type')
            .unique()
            .forEach(function(ressourceType) { result[ressourceType] = true; });

        ['caMicroEntreprise', 'caAutoEntrepreneur', 'revenusAgricolesTns', 'autresRevenusTns'].forEach(function(ressourceType) {
            if (individu[ressourceType]) {
                result[ressourceType] = true;
            }
        });

        return result;
    }

    $scope.selectedRessourceTypes = extractIndividuSelectedRessourceTypes($scope.individu);
    $scope.pageTitle = $scope.getPageTitle($scope.individu);
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
        var currentRessources = _.clone($scope.ressources);
        $scope.ressources.length = 0;
        ressourceTypes.forEach(function(ressourceType) {
            if (! $scope.selectedRessourceTypes[ressourceType.id]) {
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
        applySelectedRessources();
        if ($scope.ressources.length) {
            $state.go('foyer.ressources.montants');
        } else {
            $scope.declareNextIndividuResources();
        }
    };

    $scope.shouldInitiallyOpen = function(category) {
        var categoriesWithResourceDeclared = $scope.ressources.map(function(ressource) {
            return ressource.type.category;
        });
        return categoriesWithResourceDeclared.indexOf(category.id) >= 0;
    };
});
