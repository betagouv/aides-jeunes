'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesIndividusCtrl', function($scope, $state, $stateParams, situationsFamiliales, SituationService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    $scope.situationsFamiliales = situationsFamiliales;
    $scope.situationsMaritales = _.indexBy(_.filter(situationsFamiliales, 'isSituationCouple'), 'value');
    $scope.conjoint = _.find(situation.individus, { role: 'conjoint' });

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
        $state.go('infos_complementaires.adresse_contact', {droit: $stateParams.droit});
    };
});
