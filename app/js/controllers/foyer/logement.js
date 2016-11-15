'use strict';

angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, $http, $log, logementTypes, locationTypes, loyerLabels, ImpactStudyService, SituationService, IndividuService) {

    $scope.updateCities = function updateCities() {
        if (! $scope.logement.postalCode)
            return;  // the user has made the value invalid since we were called

        $scope.retrievingCities = true;

        $http.get('/api/outils/communes/' + $scope.logement.postalCode)
             .then(function(result) {
                  $scope.cities = result.data;
                  var city = $scope.situation.logement && _.find($scope.cities, {codeInsee: $scope.situation.logement.adresse.codeInsee});
                  logement.adresse = city || $scope.cities[0] || {};
              }, $log.error.bind($log)
              ).finally(function() {
                  $scope.retrievingCities = false;
              });
    };

    var logement = $scope.logement = {
        adresse: {},
        inhabitantForThreeYearsOutOfLastFive: true
    };
    if ($scope.situation.logement) {
        logement = $scope.logement = _.merge(logement, $scope.situation.logement);
        $scope.logement.postalCode = $scope.situation.logement.adresse.codePostal;
        $scope.updateCities();
    }

    $scope.logementTypes = logementTypes;
    $scope.locationTypes = locationTypes;
    $scope.demandeur = SituationService.getDemandeur($scope.situation);

    function cityStartsWith(prefix) {
        return logement.adresse.nomCommune && logement.adresse.nomCommune.indexOf(prefix.toUpperCase()) === 0;
    }

    $scope.yearsAgo = function yearsAgo(amount) {
        return moment().subtract(amount, 'years').format('MMMM YYYY');
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
        return logement.type == 'locataire' && angular.isDefined(logement.colocation);
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
        return _.any([
            angular.isDefined(logement.primoAccedant),
            logement.locationType == 'foyer',
            angular.isDefined(logement.isChambre)
        ]);
    };

    $scope.captureCodePostal = function() {
        return _.any([
            angular.isDefined(logement.primoAccedant),
            logement.locationType == 'foyer',
            angular.isDefined(logement.isChambre),
            logement.type == 'heberge' && angular.isDefined(logement.participationFrais),
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
        ['colocation', 'locationType', 'membreFamilleProprietaire', 'primoAccedant', 'loyer', 'charges', 'isChambre', 'participationFrais'].forEach(function(field) {
            delete logement[field];
        });
        logement.loyer = 0;
        delete $scope.demandeur.habiteChezParents;
    };

    $scope.isResidentMayotte = function isResidentMayotte() {
        return logement.adresse.codePostal && logement.adresse.codePostal.indexOf('976') === 0;
    };

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid && logement.adresse) {
            logement.inhabitantForThreeYearsOutOfLastFive = logement.inhabitantForThreeYearsOutOfLastFive && cityStartsWith('Paris');
            $scope.$emit('logement', logement);
            ImpactStudyService.sendPostCode($scope.situation);
        }
    };
});
