'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, ressourceCategories, ressourceTypes, $state) {

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.ressourceCategories = ressourceCategories;
    var filteredRessourceTypes = _.filter(ressourceTypes, function(ressourceType) {
        return ! _.contains(['pensionsAlimentairesVersees'], ressourceType.id);
    });
    $scope.ressourceTypesByCategories = _.groupBy(filteredRessourceTypes, 'category');

    $scope.submit = function() {
        $scope.applySelectedRessources($scope.selectedRessourceTypes, $scope.ressources);
        if (_.some($scope.selectedRessourceTypes)) {
            $state.go('foyer.ressources.individu.montants');
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
