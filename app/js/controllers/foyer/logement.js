'use strict';

angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    $scope.logementTypes = SituationService.logementTypes;
    $scope.locationTypes = [
        {
            value: 'nonmeuble',
            label: 'non meublé'
        },
        {
            value: 'meublehotel',
            label: 'meublé / hôtel'
        },
        {
            value: 'hlm',
            label: 'HLM'
        }
    ];

    $scope.locationTypesLabels = {};
    $scope.locationTypes.forEach(function(locationType) {
        $scope.locationTypesLabels[locationType.value] = locationType.label;
    });

    $scope.logementLabels = {};
    $scope.logementTypes.forEach(function(logementType) {
        $scope.logementLabels[logementType.value] = logementType.label;
    });

    $scope.submit = function() {
        $scope.situation.logement.formCompleted = true;
    };
});
