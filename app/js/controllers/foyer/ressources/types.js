'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope, $stateParams, ABTestingService, ressourceCategories, ressourceTypes, $state, RessourceService) {

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract(1, 'years');
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.ressourceCategories = ressourceCategories;

    var keyedRessourceTypes = _.keyBy(ressourceTypes, 'id');
    var filteredRessourceTypes = _.filter(ressourceTypes, RessourceService.isRessourceOnMainScreen);
    $scope.ressourceTypesByCategories = _.groupBy(filteredRessourceTypes, 'category');

    var abtesting = ABTestingService.getEnvironment();
    $scope.hideHelp = abtesting && abtesting.resourceHelp && abtesting.resourceHelp.value === "Hide";

    $scope.isOpen = {
        'revenusActivite': true // If nothing is selected
    };
    _.each($scope.selectedRessourceTypes, function(isSelected, ressourceTypeId) {
        if (isSelected) {
            $scope.isOpen[keyedRessourceTypes[ressourceTypeId].category] = true;
        }
    });

    function updateIndividuRessources(individu, selectedRessourceTypes) {
        Object.keys(selectedRessourceTypes).forEach(function(ressourceTypeId) {
            if (selectedRessourceTypes[ressourceTypeId]) {
                individu[ressourceTypeId] = individu[ressourceTypeId] || {};
            } else {
                RessourceService.unsetForCurrentYear($scope.situation.dateDeValeur, individu, keyedRessourceTypes[ressourceTypeId]);
                delete selectedRessourceTypes[ressourceTypeId];
            }
        });
    }
    $scope._updateIndividuRessources = updateIndividuRessources;

    $scope.submit = function() {
        updateIndividuRessources($scope.individu, $scope.selectedRessourceTypes);
        if (_.some($scope.selectedRessourceTypes)) {
            $state.go('foyer.ressources.individu.montants');
        } else {
            $scope.individu.hasRessources = ! _.isEmpty($scope.selectedRessourceTypes);
            $scope.declareNextIndividuResources(parseInt($stateParams.individu));
        }
    };
});
