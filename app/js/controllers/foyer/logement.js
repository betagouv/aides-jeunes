'use strict';

angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, $http, SituationService) {
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

    $scope.updateCities = function() {
        $scope.cities = [];
        var codePostal = $scope.situation.logement.adresse.codePostal;
        if (9999 < codePostal && 100000 > codePostal) {
            var baseApi = '//public.opendatasoft.com/api/records/1.0/search?dataset=correspondance-code-insee-code-postal&format=jsonp&callback=JSON_CALLBACK&q=';
            $http.jsonp(baseApi + $scope.situation.logement.adresse.codePostal).then(function(result) {
                $scope.cities = [];
                result.data.records.forEach(function(record) {
                    var field = 'nom_comm';
                    $scope.cities.push(record.fields[field]);
                });
                $scope.situation.logement.adresse.ville = $scope.cities[0];
            });
        } else {
            $scope.situation.logement.adresse.ville = null;
        }
    };

    $scope.submit = function() {
        $scope.situation.logement.formCompleted = true;
    };
});
