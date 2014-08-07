'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesNomsPrenomsCtrl', function($scope, $state, SituationService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    situation.demandeur.civilite = 'h';
    if (situation.conjoint) {
        situation.conjoint.civilite = 'f';
    }

    $scope.individus = situation.enfants.concat(situation.personnesACharge);
    $scope.individus.forEach(function(individu) {
        individu.civilite = 'h';
    });

    $scope.submit = function(form) {
        if (form.$invalid) {
            $scope.error = true;
        } else {
            $state.go('form_infos_complementaires_address');
        }
    };
});
