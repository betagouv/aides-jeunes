'use strict';

angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    $scope.logementTypes = SituationService.logementTypes;
    $scope.logementLabels = {};
    _.forEach($scope.logementTypes, function(logementType) {
        $scope.logementLabels[logementType.value] = logementType.label;
    });

    $scope.submit = function() {
        $scope.formSubmitted = true;
    };
});
