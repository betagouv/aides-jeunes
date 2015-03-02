'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesIndividusCtrl', function($scope, $state, $stateParams, situationsFamiliales, SituationService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    $scope.situationsFamiliales = situationsFamiliales;
    $scope.demandeur = _.find(situation.individus, { role: 'demandeur' });
    $scope.conjoint = _.find(situation.individus, { role: 'conjoint' });

    if ($scope.conjoint) {
        $scope.situationMaritale = _.find(situationsFamiliales, { value: $scope.conjoint.statutMarital }).label;
    }

    $scope.enfants = _.where(situation.individus, { role: 'enfant' });

    situation.individus.forEach(function(individu) {
        if (individu.paysNaissance) {
            individu.choicePaysNaissance = 'France' === individu.paysNaissance ? 'france' : 'autre';
        } else {
            individu.choicePaysNaissance = 'france';
            individu.paysNaissance = 'France';
        }
        if (!individu.civilite) {
            individu.civilite = ('conjoint' === individu.role) ? 'f' : 'h';
        }
    });

    $scope.changePaysNaissance = function(individu) {
        if ('autre' === individu.choicePaysNaissance) {
            individu.paysNaissance = '';
            individu.villeNaissance = null;
            individu.departementNaissance = null;
        } else {
            individu.paysNaissance = 'France';
        }
    };

    $scope.submit = function() {
        $state.go('infos_complementaires.adresse_contact', { droit: $stateParams.droit });
    };
});
