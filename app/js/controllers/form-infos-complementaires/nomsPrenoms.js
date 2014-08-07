'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesNomsPrenomsCtrl', function($scope, $state, SituationService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    situation.demandeur.sexe = 'm';
    if (situation.conjoint) {
        situation.conjoint.sexe = 'f';
    }

    $scope.individus = situation.enfants.concat(situation.personnesACharge);
    $scope.individus.forEach(function(individu) {
        individu.sexe = 'm';
    });

    $scope.submit = function(form) {
        if (form.$invalid) {
            $scope.error = true;
        } else {
            $state.go('form_infos_complementaires_address');
        }
    };
});
