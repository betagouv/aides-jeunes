'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $state, $stateParams, $filter, $location, $modal, SituationService, IndividuService) {
    var situation = $scope.situation = SituationService.restoreLocal();

    $scope.$on('setSituation', function(e, newSituation) {
        situation = $scope.situation = newSituation;
    });

    $scope.statutsSpecifiques = IndividuService.formatStatutsSpecifiques;
    $scope.nationalite = IndividuService.nationaliteLabel;
    $scope.getLabel = IndividuService.label;

    $scope.$on('individu.demandeur', function(e, demandeur) {
        if (_.find(situation.individus, { role: 'demandeur' })) {
            situation.individus[0] = demandeur;
        } else {
            situation.individus.push(demandeur);
        }
        $state.go('foyer.conjoint');
    });

    $scope.$on('individu.conjoint', function(e, conjoint) {
        if (conjoint) {
            // si le conjoint existait déjà avant, on l'écrase
            if (_.find(situation.individus, { role: 'conjoint' })) {
                situation.individus[1] = conjoint;
            } else { // on insère le conjoint juste derrière le demandeur dans l'array des individus
                situation.individus.splice(1, 0, conjoint);
            }
        } else { // on supprime l'éventuel conjoint qui existait avant
            situation.individus = _.filter(situation.individus, function(individu) {
                return 'conjoint' !== individu.role;
            });
        }
        $state.go('foyer.personnesACharge');
    });

    $scope.$on('personnesACharge', function(e, personnesACharge) {
        situation.individus = _.filter(situation.individus, function(individu) {
            return 'enfant' !== individu.role;
        });

        situation.individus = situation.individus.concat(personnesACharge);
        $state.go('foyer.logement');
    });

    var isLogementInMayotte = function(logement) {
        return 0 === logement.adresse.codePostal.indexOf('976');
    };

    $scope.$on('logement', function(e, logement) {
        situation.logement = logement;
        $scope.$broadcast('logementCaptured');
        // affichage de la popup pour les habitants de mayotte
        if (isLogementInMayotte(logement)) {
            $modal.open({ templateUrl: '/partials/modal-exclusion-mayotte.html' });
        } else {
            $state.go('foyer.ressources');
        }
    });

    var goToSimulation = function() {
        SituationService.save($scope.situation).then(function() {
            // désactivation du changement d'url dans le navigateur pour que le bouton back fonctionne
            $state.transitionTo('situation', { 'situationId': $scope.situation._id }, { location: false });
        });
    };

    $scope.$on('ressources', function() {
        $scope.situation.ressourcesCaptured = true;
        $scope.$broadcast('ressourcesUpdated');
        $state.go('foyer.pensionsAlimentaires');
    });

    $scope.$on('pensionsAlimentaires', function() {
        goToSimulation();
    });

    $scope.$on('rnc', function() {
        // si un enfant est scolarisé on demande son rfr (bourses collège/lycée), sinon pas besoin
        if (SituationService.hasEnfantScolarise($scope.situation)) {
            $state.go('foyer.rfr');
        } else {
            $scope.situation.ressourcesYearMoins2Captured = true;
            $scope.$broadcast('ressourcesYearMoins2Captured');
            goToSimulation();
        }
    });

    $scope.$on('rfr', function(e, rfr) {
        $scope.situation.rfr = rfr;
        $scope.situation.ressourcesYearMoins2Captured = true;
        $scope.$broadcast('ressourcesYearMoins2Captured');
        goToSimulation();
    });

    $scope.$on('patrimoine', function(e, patrimoine) {
        situation.patrimoine = patrimoine;
        $scope.$broadcast('patrimoineCaptured');
        goToSimulation();
    });
});
