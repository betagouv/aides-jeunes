'use strict';

angular.module('ddsApp').controller('FoyerRessourcesIndividuCtrl', function($scope, $state, $stateParams, SituationService, IndividuService, RessourceService, ressourceTypes) {

    function extractIndividuSelectedRessourceTypes (individu) {
        var result = {};
        _.chain(ressourceTypes)
            .map('id')
            .uniq()
            .filter(RessourceService.isRessourceOnMainScreen)
            .filter(function(ressourceType) { return individu[ressourceType]; })
            .filter(function(ressourceType) { return ressourceType != 'pensions_alimentaires_versees_individu'; })
            .forEach(function(ressourceType) { result[ressourceType] = true; })
            .value();

        return result;
    }

    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    var individuIndex = parseInt($stateParams.individu);
    $scope.individu = $scope.sortedIndividus[individuIndex];
    $scope.selectedRessourceTypes = extractIndividuSelectedRessourceTypes($scope.individu);
    $scope.pageTitle = IndividuService.ressourceHeader($scope.individu);
});
