'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesIndividusCtrl', function($scope, $state, $stateParams, SituationService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    $scope.relationTypeLabels = SituationService.relationTypeLabels;

    $scope.situationsFamiliales = [
        {
            value: 'celibataire',
            label: 'Célibataire depuis toujours'
        },
        {
            value: 'divorce',
            label: 'Divorcé'
        },
        {
            value: 'veuf',
            label: 'Veuf'
        },
        {
            value: 'separe',
            label: 'Séparé de fait'
        },
        {
            value: 'pacs_rompu',
            label: 'Pacs rompu'
        },
        {
            value: 'concubinage_rompu',
            label: 'Concubinage rompu'
        }
    ];

    var initPaysNaissance = function(individu) {
        if (individu.paysNaissance) {
            individu.choicePaysNaissance = 'France' === individu.paysNaissance ? 'france' : 'autre';
        } else {
            individu.choicePaysNaissance = 'france';
            individu.paysNaissance = 'France';
        }
    };

    initPaysNaissance(situation.demandeur);
    if (!situation.demandeur.civilite) {
        situation.demandeur.civilite = 'h';
    }

    if (situation.conjoint) {
        if (!situation.conjoint.civilite) {
            situation.conjoint.civilite = 'f';
        }
        initPaysNaissance(situation.conjoint);
    }

    $scope.enfantsEtPersonnesACharges = situation.enfants.concat(situation.personnesACharge);
    $scope.enfantsEtPersonnesACharges.forEach(function(individu) {
        if (!individu.civilite) {
            individu.civilite = 'h';
        }
        initPaysNaissance(individu);
        if (individu.demandeurEmploi) {
            individu.situation = 'demandeur_emploi';
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
        if (null === situation.demandeur.situationFamiliale) {
            delete situation.demandeur.situationFamiliale;
        }
        $state.go('form_infos_complementaires_address_contact', {droit: $stateParams.droit});
    };
});
