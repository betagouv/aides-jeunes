'use strict';


angular.module('ddsApp').controller('FoyerLogementCtrl', function($scope, $http, $log, logementTypes, locationTypes, CityService, SituationService, IndividuService, LogementService) {
    var famille = $scope.famille = $scope.situation.famille;
    var menage = $scope.menage = $scope.situation.menage;

    $scope.cities = [];
    $scope.logementTypes = logementTypes;
    $scope.locationTypes = locationTypes;
    $scope.demandeur = SituationService.getDemandeur($scope.situation);

    var logement = $scope.logement = LogementService.getLogementVariables(menage.statut_occupation_logement);
    logement.pretSigneAvant2018 = moment(menage.aide_logement_date_pret_conventionne, 'YYYY-MM-DD').get('year') < 2018;


    function cityStartsWith(prefix) {
        return $scope.isAdresseValid() && $scope.menage.nom_commune.toUpperCase().indexOf(prefix.toUpperCase()) === 0;
    }

    $scope.yearsAgo = function yearsAgo(amount) {
        return moment().subtract(amount, 'years').format('MMMM YYYY');
    };

    $scope.captureCharges = function() {
        return (logement.type == 'locataire') && (logement.locationType !== 'meublehotel');
    };

    $scope.loyerLabel = function() {
        switch (logement.type) {
        case 'locataire':
        {
            var elements = [];
            if (menage.coloc) {
                elements.push('Votre part du loyer');
            } else {
                elements.push('Votre loyer');
            }

            if ($scope.captureCharges()) {
                elements.push('(hors charges)');
            } else {
                elements.push('(charges comprises)');
            }

            return elements.join(' ');
        }
        default: {
            return 'Montant des mensualités';
        }
        }
    };

    $scope.captureColocation = function() {
        return logement.type == 'locataire';
    };

    $scope.captureProprietaireProcheFamille = function() {
        return logement.type == 'locataire' && angular.isDefined(menage.coloc);
    };

    $scope.captureLocationType = function() {
        return logement.type == 'locataire' && angular.isDefined(famille.proprietaire_proche_famille);
    };

    $scope.captureChambre = function() {
        return logement.type == 'locataire' && 'foyer' !== logement.locationType && angular.isDefined(logement.locationType);
    };

    $scope.captureHabiteChezParents = function() {
        var age = IndividuService.age($scope.demandeur);
        return (logement.type == 'heberge') && $scope.demandeur.fiscalementIndependant && (age >= 18) && (age < 25) && (! SituationService.hasEnfant($scope.situation));
    };

    $scope.captureParticipationFrais = function() {
        return (logement.type == 'heberge') && (! $scope.captureHabiteChezParents() || angular.isDefined($scope.demandeur.habite_chez_parents));
    };

    $scope.capturePretSigneAvant2018 = function() {
        return logement.type == 'proprietaire' && logement.primoAccedant && (menage && menage.loyer > 0);
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
        ['locationType', 'primoAccedant'].forEach(function(field) {
            delete logement[field];
        });
        ['proprietaire_proche_famille'].forEach(function(field) {
            delete famille[field];
        });
        ['charges_locatives', 'coloc', 'logement_chambre', 'participation_frais'].forEach(function(field) {
            delete menage[field];
        });
        menage.loyer = 0;

        delete $scope.demandeur.habite_chez_parents;
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
            menage.statut_occupation_logement = LogementService.getStatutOccupationLogement(logement);
            menage.aide_logement_date_pret_conventionne = logement.pretSigneAvant2018 ? '2017-12-31' : '2018-01-01';
            $scope.$emit('logement');
        }
    };
});
