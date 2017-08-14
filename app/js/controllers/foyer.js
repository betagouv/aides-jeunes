'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $state, $stateParams, $filter, $location, SituationService, IndividuService) {
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

        var demandeur = SituationService.getDemandeur(situation);
        demandeur.statut_marital = conjoint.statut_marital;

        $state.go('foyer.logement');
    });

    $scope.$on('enfants', function(e, enfants) {
        SituationService.setEnfants(situation, enfants);
        $state.go('foyer.conjoint');
    });

    $scope.$on('logement', function(e, logement) {
        situation.logement = logement;
        $scope.$broadcast('logementCaptured');
        $state.go('foyer.ressources.individu.types', { individu: 0 });
    });

    $scope.$on('pensionsAlimentaires', function() {
        $scope.$broadcast('ressourcesUpdated');
        $state.go('foyer.resultat');
    });

    $scope.$on('rnc', function() {
        $scope.$broadcast('ym2Captured');
        // si un enfant est scolarisé on demande son rfr (bourses collège/lycée), sinon pas besoin
        if (SituationService.hasEnfantScolarise($scope.situation)) {
            $state.go('foyer.rfr');
        } else {
            $state.go('foyer.resultat');
        }
    });

    $scope.$on('rfr', function(e) {
        $scope.$broadcast('ym2Captured');
        $state.go('foyer.resultat');
    });

    $scope.$on('patrimoine', function(e) {
        $scope.$broadcast('patrimoineCaptured');
        $state.go('foyer.resultat');
    });
});
