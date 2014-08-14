'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesIndividusCtrl', function($scope, $state, $stateParams, SituationService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    $scope.relationTypeLabels = SituationService.relationTypeLabels;

    var initPaysNaissance = function(individu) {
        individu.choicePaysNaissance = 'france';
        individu.paysNaissance = 'France';
    };

    initPaysNaissance(situation.demandeur);
    situation.demandeur.civilite = 'h';
    if (situation.conjoint) {
        situation.conjoint.civilite = 'f';
        initPaysNaissance(situation.conjoint);
    }

    $scope.individus = situation.enfants.concat(situation.personnesACharge);
    $scope.individus.forEach(function(individu) {
        individu.civilite = 'h';
        initPaysNaissance(individu);
        if (individu.demandeurEmploi) {
            individu.situation = 'demandeur_emploi';
        }
    });

    $scope.choicePaysNaissance = function(individu) {
        if ('autre' === individu.choicePaysNaissance) {
            individu.paysNaissance = '';
            individu.villeNaissance = null;
            individu.departementNaissance = null;
        } else {
            individu.paysNaissance = 'France';
        }
    };

    $scope.submit = function() {
        $state.go('form_infos_complementaires_address_contact', {requestedCerfa: $stateParams.requestedCerfa});
    };
});
