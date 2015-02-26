'use strict';

angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, $http, logementTypes, locationTypes, loyerLabels) {
    var logement = $scope.logement = { adresse: {} };
    if ($scope.situation.logement) {
        logement = $scope.logement = _.merge(logement, $scope.situation.logement);
    }

    $scope.logementTypes = logementTypes;
    $scope.locationTypes = locationTypes;

    $scope.loyerLabel = function() {
        var result = loyerLabels[logement.type];
        if (logement.type === 'locataire') {
            if ('meublehotel' === logement.locationType) {
                result += ' (charges comprises)';
            } else {
                result += ' (hors charges)';
            }
        }

        return result;
    };

    $scope.captureMembreFamilleProprietaire = function() {
        return 'locataire' === logement.type && angular.isDefined(logement.colocation);
    };

    $scope.capturePretConventionne = function() {
        return true === logement.primoAccedant;
    };

    $scope.captureLocationType = function() {
        return 'locataire' === logement.type && angular.isDefined(logement.membreFamilleProprietaire);
    };

    $scope.captureChambre = function() {
        return 'locataire' === logement.type && 'foyer' !== logement.locationType && angular.isDefined(logement.locationType);
    };

    $scope.captureLoyer = function() {
        if ('gratuit' === logement.type) {
            return false;
        }

        return _.any([
            true === logement.primoAccedant && angular.isDefined(logement.pretConventionne),
            'foyer' === logement.locationType,
            angular.isDefined(logement.isChambre)
        ]);
    };

    $scope.captureCodePostal = function() {
        return _.any([
            false === logement.primoAccedant || true === logement.primoAccedant && angular.isDefined(logement.pretConventionne),
            'foyer' === logement.locationType,
            angular.isDefined(logement.isChambre),
            'gratuit' === logement.type
        ]);
    };

    $scope.changeLogementType = function() {
        ['colocation', 'locationType', 'membreFamilleProprietaire', 'primoAccedant', 'loyer', 'isChambre'].forEach(function(field) {
            delete logement[field];
        });
        delete logement.adresse.codePostal;
        $scope.selectedCity = null;
        $scope.cities = [];
    };

    $scope.unknownCodePostal = true;

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
            $scope.$emit('logement', logement);
        }
    };

    $scope.updateSelectedCity = function(selectedCity) {
        $scope.selectedCity = selectedCity;
    };
});
