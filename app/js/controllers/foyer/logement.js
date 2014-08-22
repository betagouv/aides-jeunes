'use strict';

angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, SituationService) {
    $scope.situation = SituationService.restoreLocal();

    if (!$scope.situation.logement) {
        $scope.situation.logement = {};
    }
    if (!$scope.situation.logement.adresse) {
        $scope.situation.logement.adresse = {};
    }

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

    $scope.primoAccedantTooltip = 'Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire de sa résidence principale dans les deux années qui viennent de s’écouler.';

    $scope.submit = function() {
        $scope.situation.logement.formCompleted = true;
    };
});
