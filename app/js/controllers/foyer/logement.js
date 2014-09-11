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

    var membreFamilleProprietaireCapture = function() {
        return 'payant' === situation.logement.type && angular.isDefined(situation.logement.membreFamilleProprietaire);
    };

    $scope.captureLoyer = function() {
        var result = 'gratuit' !== situation.logement.type;
        result = result &&
            (angular.isDefined(situation.logement.primoAccedant) ||
             angular.isDefined(situation.logement.locationType) ||
             membreFamilleProprietaireCapture());

        return result;
    };

    $scope.captureCodePostal = function() {
        var result = angular.isDefined(situation.logement.primoAccedant);
        result = result || angular.isDefined(situation.logement.locationType);
        result = result || 'gratuit' === situation.logement.type;
        result = result || membreFamilleProprietaireCapture();

        return result;
    };

    $scope.updateCities = function() {
        $scope.unknownCodePostal = false;
        $scope.cities = [];
        var codePostal = situation.logement.adresse.codePostal;
        $scope.retrievingCities = false;
        $scope.situation.logement.adresse.ville = null;

        if (9999 < codePostal && 100000 > codePostal) {
            $scope.retrievingCities = true;
            var baseApi = '//public.opendatasoft.com/api/records/1.0/search?dataset=correspondance-code-insee-code-postal&format=jsonp&callback=JSON_CALLBACK&rows=1000&q=';
            $http.jsonp(baseApi + situation.logement.adresse.codePostal).then(function(result) {
                var records = result.data.records;
                if (!records.length) {
                    $scope.unknownCodePostal = true;
                } else {
                    $scope.unknownCodePostal = false;
                    $scope.cities = [];
                    result.data.records.forEach(function(record) {
                        var field = 'nom_comm';
                        $scope.cities.push(record.fields[field]);
                    });
                    situation.logement.adresse.ville = $scope.cities[0];
                }
            }, function() {
                $scope.unknownCodePostal = true;
            }).finally(function() {
                $scope.retrievingCities = false;
            });
        } else if (100000 <= codePostal) {
            $scope.unknownCodePostal = true;
        }
    };

    $scope.submit = function() {
        situation.logement.formCompleted = true;
    };
});
