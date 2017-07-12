'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, $stateParams, ressourceCategories, ressourceTypes, $state, RessourceService) {

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.ressourceCategories = ressourceCategories;

    var filteredRessourceTypes = _.filter(ressourceTypes, RessourceService.isRessourceOnMainScreen);
    $scope.ressourceTypesByCategories = _.groupBy(filteredRessourceTypes, 'category');

    $scope.shouldInitiallyOpen = function(category) {
        var selectedRessourceTypes = Object.keys($scope.selectedRessourceTypes);
        if (! selectedRessourceTypes.length) {
            return category.id == 'revenusActivite';
        }

        return _.some(selectedRessourceTypes, function(ressourceTypeName) {
            return _.find(ressourceTypes, { id: ressourceTypeName }).category == category.id;
        });
    };

    $scope.applySelectedRessources = function (selectedRessourceTypes) {
        Object.keys(selectedRessourceTypes).forEach(function(ressourceTypeId) {
            if (selectedRessourceTypes[ressourceTypeId]) {
                $scope.individu[ressourceTypeId] = $scope.individu[ressourceTypeId] || {};
            } else {
                delete $scope.individu[ressourceTypeId];
            }
        });
    };

    $scope.submit = function() {
        $scope.applySelectedRessources($scope.selectedRessourceTypes);
        if (_.some($scope.selectedRessourceTypes)) {
            $state.go('foyer.ressources.individu.montants');
        } else {
            $scope.declareNextIndividuResources(parseInt($stateParams.individu));
        }
    };
});
