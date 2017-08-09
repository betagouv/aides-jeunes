'use strict';

angular.module('ddsApp').controller('FoyerRessourcesIndividuCtrl', function($scope, $stateParams, SituationService, IndividuService, RessourceService) {
    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    var individuIndex = parseInt($stateParams.individu);
    $scope.individu = $scope.sortedIndividus[individuIndex];
    $scope.selectedRessourceTypes = RessourceService.extractIndividuSelectedRessourceTypes($scope.individu);
    $scope.pageTitle = IndividuService.ressourceHeader($scope.individu);
});
