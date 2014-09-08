'use strict';

angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, $http, logementTypes, situation) {
    $scope.situation = situation;

    if (!situation.logement) {
        situation.logement = {};
    }
    if (!situation.logement.adresse) {
        situation.logement.adresse = {};
    }

    $scope.logementTypes = logementTypes;
    $scope.locationTypes = _.find(logementTypes, { id: 'locataire' }).locationTypes;

    $scope.locationTypeLabel = function() {
        return _.find($scope.locationTypes, { id: situation.logement.locationType }).label;
    };

    $scope.logementTypeLabel = function() {
        return _.find(logementTypes, { id: situation.logement.type }).label;
    };

    $scope.loyerLabel = function() {
        return 'proprietaire' === situation.logement.type ? 'mensualité d\'emprunt' : 'loyer';
    };

    $scope.primoAccedantTooltip = 'Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire de sa résidence principale dans les deux années qui viennent de s’écouler.';

    $scope.updateCities = function() {
        $scope.cities = [];
        var codePostal = situation.logement.adresse.codePostal;
        if (9999 < codePostal && 100000 > codePostal) {
            var baseApi = '//public.opendatasoft.com/api/records/1.0/search?dataset=correspondance-code-insee-code-postal&format=jsonp&callback=JSON_CALLBACK&rows=1000&q=';
            $http.jsonp(baseApi + situation.logement.adresse.codePostal).then(function(result) {
                $scope.cities = [];
                result.data.records.forEach(function(record) {
                    var field = 'nom_comm';
                    $scope.cities.push(record.fields[field]);
                });
                situation.logement.adresse.ville = $scope.cities[0];
            });
        } else {
            $scope.situation.logement.adresse.ville = null;
        }
    };

    $scope.submit = function() {
        situation.logement.formCompleted = true;
    };
});
