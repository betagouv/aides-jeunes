'use strict';

angular.module('ddsApp').controller('FoyerCaptureLogementModalCtrl', function($scope, $http, $modalInstance, logementTypes, locationTypes, loyerLabels, situation) {
    if (!situation.logement) {
        situation.logement = {};
    }
    if (!situation.logement.adresse) {
        situation.logement.adresse = {};
    }
    var logement = $scope.logement = situation.logement;
    $scope.logementTypes = logementTypes;
    $scope.locationTypes = locationTypes;
    $scope.loyerLabels = loyerLabels;

    var membreFamilleProprietaireCaptured = function() {
        return 'payant' === logement.type && angular.isDefined(logement.membreFamilleProprietaire);
    };

    $scope.captureMembreFamilleProprietaire = function() {
        if ('payant' === logement.type) {
            return true;
        } else if ('locataire' === logement.type) {
            return angular.isDefined(logement.colocation);
        }

        return false;
    };

    $scope.captureLocationType = function() {
        return 'locataire' === logement.type && angular.isDefined(logement.membreFamilleProprietaire);
    };

    $scope.captureLoyer = function() {
        if ('gratuit' === logement.type) {
            return false;
        }

        return _.any([
            true === logement.primoAccedant,
            angular.isDefined(logement.locationType),
            membreFamilleProprietaireCaptured()
        ]);
    };

    $scope.captureCodePostal = function() {
        return _.any([
            angular.isDefined(logement.primoAccedant),
            angular.isDefined(logement.locationType),
            'gratuit' === logement.type,
            membreFamilleProprietaireCaptured()
        ]);
    };

    $scope.changeLogementType = function() {
        ['colocation', 'locationType', 'membreFamilleProprietaire', 'primoAccedant', 'loyer'].forEach(function(field) {
            delete logement[field];
        });
        delete logement.adresse.codePostal;
        $scope.selectedCity = null;
        $scope.cities = [];
    };

    $scope.updateCities = function() {
        $scope.retrievingCities = false;
        $scope.cities = [];

        var codePostal = logement.adresse.codePostal;
        if (!codePostal || 5 !== codePostal.length) {
            $scope.unknownCodePostal = true;
            return;
        }

        $scope.retrievingCities = true;
        $http.get('/api/outils/communes', { params: { codePostal: codePostal } }).then(function(result) {
            var records = result.data.records;
            if (!records.length) {
                $scope.unknownCodePostal = true;
            } else {
                $scope.unknownCodePostal = false;
                $scope.cities = [];
                records.forEach(function(record) {
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
            logement.adresse.ville = $scope.selectedCity.nom;
            logement.adresse.codeInsee = $scope.selectedCity.codeInsee;
            situation.logementCaptured = true;
            $scope.$emit('logementCaptured');
            $modalInstance.close();
        }
    };

    $scope.updateSelectedCity = function(selectedCity) {
        $scope.selectedCity = selectedCity;
    };
});
