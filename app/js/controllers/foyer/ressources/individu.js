'use strict';

angular.module('ddsApp').controller('FoyerRessourcesIndividuCtrl', function($scope, $stateParams, MonthService, IndividuService, RessourceService) {
    $scope.months = MonthService.getMonths($scope.situation.dateDeValeur);
    var individuIndex = parseInt($stateParams.individu);
    $scope.individu = $scope.sortedIndividus[individuIndex];
    $scope.selectedRessourceTypes = RessourceService.extractIndividuSelectedRessourceTypes($scope.individu);
    $scope.pageTitle = IndividuService.ressourceHeader($scope.individu);
});
