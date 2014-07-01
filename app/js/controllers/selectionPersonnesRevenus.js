'use strict';

angular.module('ddsApp').controller('SelectionPersonnesRevenusCtrl', function($scope, SituationService) {
    var situation = SituationService.restoreLocal();
    $scope.individus = SituationService.createIndividusList(situation);

    $scope.selectedIndividus = {};
});
