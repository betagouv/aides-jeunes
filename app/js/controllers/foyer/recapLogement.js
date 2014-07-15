'use strict';

angular.module('ddsApp').controller('FoyerRecapLogementCtrl', function($scope, SituationService) {
    $scope.logementLabels = {};
    _.forEach(SituationService.logementTypes, function(logementType) {
        $scope.logementLabels[logementType.value] = logementType.label;
    });
});
