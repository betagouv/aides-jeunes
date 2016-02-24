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
        $state.go('foyer.enfants');
    });

    $scope.$on('individu.conjoint', function(e, conjoint) {
        SituationService.setConjoint(situation, conjoint);
        $state.go('foyer.logement');
    });

    $scope.$on('individu.pasDeConjoint', function() {
        // on supprime l'éventuel conjoint qui existait avant
        situation.individus = _.filter(situation.individus, function(individu) {
            return 'conjoint' !== individu.role;
        });

        // En cas de parent isolé, on pose une question supplémentaire
        if (! SituationService.hasEnfant($scope.situation)) {
            $state.go('foyer.logement');
        }
    });

    $scope.$on('enfants', function(e, enfants) {
        SituationService.setEnfants(situation, enfants);
        $state.go('foyer.conjoint');
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

    var goToResultat = function() {
        SituationService.save($scope.situation).then(function() {
            // désactivation du changement d'url dans le navigateur pour que le bouton back fonctionne
            $state.transitionTo('situation', { 'situationId': $scope.situation._id }, { location: false });
        });
    };

    $scope.$on('ressources', function() {
        $scope.situation.ressourcesCaptured = true;
        $scope.$broadcast('ressourcesUpdated');
        $state.go('foyer.pensionsAlimentaires');
    });

    $scope.$on('pensionsAlimentaires', function() {
        goToResultat();
    });

    $scope.$on('rnc', function() {
        // si un enfant est scolarisé on demande son rfr (bourses collège/lycée), sinon pas besoin
        if (SituationService.hasEnfantScolarise($scope.situation)) {
            $state.go('foyer.rfr');
        } else {
            goToResultat();
        }
    });

    $scope.$on('rfr', function(e, rfr) {
        $scope.situation.rfr = rfr;
        goToResultat();
    });

    $scope.$on('patrimoine', function(e, patrimoine) {
        situation.patrimoine = patrimoine;
        $scope.$broadcast('patrimoineCaptured');
        goToResultat();
    });
});
