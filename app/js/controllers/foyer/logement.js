'use strict';


angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, $http, $log, logementTypes, locationTypes, loyerLabels, SituationService, IndividuService) {

    $scope.updateCommunes = function updateCommunes() {
        if (! $scope.logement.postalCode) {
            $scope.communes = [];
            return;  // the user has made the value invalid since we were called
        }

        $scope.retrievingCommunes = true;

        $http.get('/api/outils/communes/' + $scope.logement.postalCode)
             .then(function(result) {
                  $scope.communes = result.data;
                  var commune = $scope.situation.logement && _.find($scope.communes, {codeInsee: $scope.situation.logement.commune.codeInsee});
                  logement.commune = commune || $scope.communes[0] || {};
              }, $log.error.bind($log)
              ).finally(function() {
                  $scope.retrievingCommunes = false;
              });
    };

    var logement = $scope.logement = {
        commune: {},
        inhabitantForThreeYearsOutOfLastFive: true
    };
    if ($scope.situation.logement) {
        logement = $scope.logement = _.merge(logement, $scope.situation.logement);
        $scope.logement.postalCode = $scope.situation.logement.commune.codePostal;
        $scope.updateCommunes();
    }

    $scope.communes = [];
    $scope.logementTypes = logementTypes;
    $scope.locationTypes = locationTypes;
    $scope.demandeur = SituationService.getDemandeur($scope.situation);

    function communeStartsWith(prefix) {
        return logement.commune.nomCommune && logement.commune.nomCommune.indexOf(prefix.toUpperCase()) === 0;
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
        return _.some([
            angular.isDefined(logement.primoAccedant),
            logement.locationType == 'foyer',
            angular.isDefined(logement.isChambre)
        ]);
    };

    $scope.captureCodePostal = function() {
        return _.some([
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
        return $scope.captureCodePostal() && logement.type != 'sansDomicile' && communeStartsWith('Paris');
    };

    $scope.changeLogementType = function() {
        ['colocation', 'locationType', 'membreFamilleProprietaire', 'primoAccedant', 'loyer', 'charges', 'isChambre', 'participationFrais'].forEach(function(field) {
            delete logement[field];
        });
        logement.loyer = 0;
        delete $scope.demandeur.habiteChezParents;
    };

    $scope.isResidentMayotte = function isResidentMayotte() {
        return logement.commune.codePostal && logement.commune.codePostal.indexOf('976') === 0;
    };

    $scope.isCommuneValid = function() {
        return logement.commune && $scope.communes.indexOf(logement.commune) > -1;
    };

    $scope.submit = function(form) {
        $scope.submitted = true;
        if (form.$valid && $scope.isCommuneValid()) {
            logement.inhabitantForThreeYearsOutOfLastFive = logement.inhabitantForThreeYearsOutOfLastFive && communeStartsWith('Paris');
            $scope.$emit('logement', logement);
        }
    };
});
