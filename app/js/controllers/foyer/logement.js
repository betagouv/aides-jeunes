'use strict';


angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, $http, $log, logementTypes, locationTypes, loyerLabels, CityService, SituationService, IndividuService) {
    var menage = $scope.menage = $scope.situation.menage;

    $scope.cities = [];
    $scope.logementTypes = logementTypes;
    $scope.locationTypes = locationTypes;
    $scope.demandeur = SituationService.getDemandeur($scope.situation);

    var logement = $scope.logement = _.assign({
        inhabitantForThreeYearsOutOfLastFive: true,
    }, $scope.situation.logement);

    $scope.updateCities = function updateCities() {
        if (! $scope.menage.code_postal) {
            $scope.cities = [];
            return;  // the user has made the value invalid since we were called
        }

        $scope.retrievingCities = true;
        CityService.getCities($scope.menage.code_postal)
        .then(function(cities) {
            $scope.cities = cities;
            var city = menage && _.find($scope.cities, { codeInsee: menage.depcom }) ||
                ($scope.cities.length && $scope.cities[0]) || {};
            menage.depcom = city.codeInsee;
            menage.nomCommune = city.nomCommune;
        }, $log.error.bind($log))
        .finally(function() {
            $scope.retrievingCities = false;
        });
    };

    $scope.updateCities();

    function cityStartsWith(prefix) {
        return $scope.isAdresseValid() && $scope.menage.nomCommune.indexOf(prefix.toUpperCase()) === 0;
    }

    $scope.yearsAgo = function yearsAgo(amount) {
        return moment().subtract(amount, 'years').format('MMMM YYYY');
    };

    $scope.captureCharges = function() {
        return (logement.type == 'locataire') && (logement.locationType !== 'meublehotel');
    };

    $scope.loyerLabel = function() {
        var result = loyerLabels[logement.type];
        if (logement.type === 'locataire') {
            if ($scope.captureCharges()) {
                result += ' (hors charges)';
            } else {
                result += ' (charges comprises)';
            }
        }

        return result;
    };

    $scope.captureColocation= function() {
        return logement.type == 'locataire';
    };

    $scope.captureMembreFamilleProprietaire = function() {
        return logement.type == 'locataire' && angular.isDefined(menage.coloc);
    };

    $scope.captureLocationType = function() {
        return logement.type == 'locataire' && angular.isDefined(logement.membreFamilleProprietaire);
    };

    $scope.captureChambre = function() {
        return logement.type == 'locataire' && 'foyer' !== logement.locationType && angular.isDefined(logement.locationType);
    };

    $scope.captureHabiteChezParents = function() {
        var age = IndividuService.age($scope.demandeur);
        return (logement.type == 'heberge') && $scope.demandeur.fiscalementIndependant && (age >= 18) && (age < 25) && (! SituationService.hasEnfant($scope.situation));
    };

    $scope.captureParticipationFrais = function() {
        return (logement.type == 'heberge') && (! $scope.captureHabiteChezParents() || angular.isDefined($scope.demandeur.habiteChezParents));
    };

    $scope.captureLoyer = function() {
        if (logement.type == 'heberge') {
            return false;
        }
        return _.some([
            angular.isDefined(logement.primoAccedant),
            logement.locationType == 'foyer',
            angular.isDefined(menage.logement_chambre)
        ]);
    };

    $scope.captureCodePostal = function() {
        return _.some([
            angular.isDefined(logement.primoAccedant),
            logement.locationType == 'foyer',
            angular.isDefined(menage.logement_chambre),
            logement.type == 'heberge' && angular.isDefined(menage.participation_frais),
            logement.type == 'sansDomicile'
        ]);
    };

    $scope.maySubmit = function() {
        return $scope.captureCodePostal() && ! $scope.isResidentMayotte();
    };

    $scope.captureResidentParis = function() {
        return $scope.captureCodePostal() && logement.type != 'sansDomicile' && cityStartsWith('Paris');
    };

    $scope.changeLogementType = function() {
        ['locationType', 'membreFamilleProprietaire', 'primoAccedant'].forEach(function(field) {
            delete logement[field];
        });
        ['charges_locatives', 'coloc', 'logement_chambre', 'loyer', 'participation_frais'].forEach(function(field) {
            delete menage[field];
        });
        delete $scope.demandeur.habiteChezParents;
    };

    $scope.isResidentMayotte = function isResidentMayotte() {
        return $scope.isAdresseValid() && menage.code_postal.indexOf('976') === 0;
    };

    $scope.isAdresseValid = function() {
        return menage.depcom && menage.code_postal;
    };

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid && $scope.isAdresseValid()) {
            logement.inhabitantForThreeYearsOutOfLastFive = logement.inhabitantForThreeYearsOutOfLastFive && cityStartsWith('Paris');
            $scope.$emit('logement', logement);
        }
    };
});
