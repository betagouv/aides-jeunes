'use strict';

angular.module('ddsApp').controller('FoyerCaptureLogementModalCtrl', function($scope, $rootScope, $http, $modalInstance, logementTypes, situation) {
    $scope.situation = situation;
    if (!situation.logement) {
        situation.logement = {};
    }
    if (!situation.logement.adresse) {
        situation.logement.adresse = {};
    }

    $scope.logementTypes = logementTypes;
    $scope.locationTypes = _.find(logementTypes, { id: 'locataire' }).locationTypes;

    $scope.loyerLabel = function() {
        return 'Votre ' + ('proprietaire' === situation.logement.type ? 'mensualité d\'emprunt' : 'loyer (hors charges)');
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
        $scope.cities = [];
        var codePostal = situation.logement.adresse.codePostal;
        $scope.retrievingCities = false;

        if (5 !== codePostal.length) {
            $scope.unknownCodePostal = true;
            return;
        }

        $scope.retrievingCities = true;
        var baseApi = '//public.opendatasoft.com/api/records/1.0/search?dataset=correspondance-code-insee-code-postal&format=jsonp&callback=JSON_CALLBACK&rows=1000&q=';
        $http.jsonp(baseApi + codePostal).then(function(result) {
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
                if (!_.contains($scope.cities, situation.logement.adresse.ville)) {
                    situation.logement.adresse.ville = $scope.cities[0];
                }
            }
        }, function() {
            $scope.unknownCodePostal = true;
        }).finally(function() {
            $scope.retrievingCities = false;
        });
    };

    $scope.updateCities();

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid && !$scope.unknownCodePostal) {
            situation.logementCaptured = true;
            $modalInstance.close();
        }
    };
});
