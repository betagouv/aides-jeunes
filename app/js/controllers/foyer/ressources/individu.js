'use strict';

angular.module('ddsApp').controller('FoyerRessourcesIndividuCtrl', function($scope, $stateParams, MonthService, IndividuService, RessourceService, SituationService) {
    $scope.months = MonthService.getMonths($scope.situation.dateDeValeur);
    var individuIndex = parseInt($stateParams.individu);
    var sortedIndividus = SituationService.getIndividusSortedParentsFirst($scope.situation);
    $scope.individu = sortedIndividus[individuIndex];
    $scope.selectedRessourceTypes = RessourceService.extractIndividuSelectedRessourceTypes($scope.individu);
    $scope.pageTitle = IndividuService.ressourceHeader($scope.individu);
});
