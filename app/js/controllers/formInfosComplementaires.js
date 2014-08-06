'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesCtrl', function($scope, SituationService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    situation.demandeur.sexe = 'm';
    if (situation.conjoint) {
        situation.conjoint.sexe = 'f';
    }

    $scope.individus = situation.enfants.concat(situation.personnesACharge);
    $scope.individus.forEach(function(individu) {
        individu.sexe = 'm';
    });

    $scope.submitIndividus = function(form) {
        if (form.$invalid) {
            $scope.error = true;
        } else {
            $scope.capturedIndividus = true;
        }
    };

    $scope.submitLogement = function() {
    };
});
