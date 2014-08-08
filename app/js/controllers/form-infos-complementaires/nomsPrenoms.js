'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesNomsPrenomsCtrl', function($scope, $state, SituationService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    situation.demandeur.civilite = 'h';
    situation.demandeur.choicePaysNaissance = 'france';
    situation.demandeur.paysNaissance = 'France';
    if (situation.conjoint) {
        situation.conjoint.civilite = 'f';
        situation.conjoint.choicePaysNaissance = 'france';
        situation.conjoint.paysNaissance = 'France';
    }

    $scope.individus = situation.enfants.concat(situation.personnesACharge);
    $scope.individus.forEach(function(individu) {
        individu.civilite = 'h';
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

    $scope.submit = function(form) {
        $state.go('form_infos_complementaires_address');
    };
});
