'use strict';

angular.module('ddsApp').controller('FoyerCaptureLogementModalCtrl', function($scope, $rootScope, $http, $modalInstance, logementTypes, locationTypes, loyerLabels, situation) {
    $scope.situation = situation;
    if (!situation.logement) {
        situation.logement = {};
    }
    if (!situation.logement.adresse) {
        situation.logement.adresse = {};
    }

    $scope.logementTypes = logementTypes;
    $scope.locationTypes = locationTypes;
    $scope.loyerLabels = loyerLabels;

    $scope.primoAccedantTooltip = 'Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire de sa résidence principale dans les deux années qui viennent de s’écouler.';

    var membreFamilleProprietaireCaptured = function() {
        return 'payant' === situation.logement.type && angular.isDefined(situation.logement.membreFamilleProprietaire);
    };

    $scope.captureMembreFamilleProprietaire = function() {
        if ('payant' === situation.logement.type) {
            return true;
        } else if ('locataire' === situation.logement.type) {
            return angular.isDefined(situation.logement.colocation);
        }

        return false;
    };

    $scope.captureLocationType = function() {
        return 'locataire' === situation.logement.type && angular.isDefined(situation.logement.membreFamilleProprietaire);
    };

    $scope.captureLoyer = function() {
        if ('gratuit' === situation.logement.type) {
            return false;
        }

        var result =
            (angular.isDefined(situation.logement.primoAccedant) ||
             angular.isDefined(situation.logement.locationType) ||
             membreFamilleProprietaireCaptured());

        return result;
    };

    $scope.captureCodePostal = function() {
        var result = angular.isDefined(situation.logement.primoAccedant);
        result = result || angular.isDefined(situation.logement.locationType);
        result = result || 'gratuit' === situation.logement.type;
        result = result || membreFamilleProprietaireCaptured();

        return result;
    };

    $scope.changeLogementType = function() {
        ['colocation', 'locationType', 'membreFamilleProprietaire', 'primoAccedant', 'loyer'].forEach(function(field) {
            delete situation.logement[field];
        });
        delete situation.logement.adresse.codePostal;
        $scope.selectedCity = null;
        $scope.cities = [];
    };

    $scope.updateCities = function() {
        $scope.retrievingCities = false;
        $scope.cities = [];

        var codePostal = situation.logement.adresse.codePostal;
        if (!codePostal || 5 !== codePostal.length) {
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
                    var nomCommune = record.fields[field];
                    field = 'insee_com';
                    var codeInsee = record.fields[field];
                    $scope.cities.push({nom: nomCommune, codeInsee: codeInsee});
                });
                $scope.selectedCity = $scope.cities[0];
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
            situation.logement.adresse.ville = $scope.selectedCity.nom;
            situation.logement.adresse.codeInsee = $scope.selectedCity.codeInsee;
            situation.logementCaptured = true;
            $modalInstance.close();
        }
    };
});
