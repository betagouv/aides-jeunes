'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesSituationProCtrl', function($scope, $state, $stateParams, situation, SituationService) {
    $scope.situation = situation;

    $scope.individusRef = [{id: 'demandeur', label: 'Vous', situationsPro: []}];
    if (situation.conjoint) {
        $scope.individusRef.push({id: 'conjoint', label: 'Votre partenaire', situationsPro: []});
    }

    $scope.situationsPro = [
        {
            id: 'sans_activite',
            label: 'Sans activité'
        },
        {
            id: 'salarie',
            label: 'Salarié'
        },
        {
            id: 'auto_entrepreneur',
            label: 'Auto-entrepreneur'
        },
        {
            id: 'travailleur_saisonnier',
            label: 'Travailleur saisonnier'
        },
        {
            id: 'apprenti',
            label: 'Apprenti'
        },
        {
            id: 'stagiaire',
            label: 'Stagiaire de la formation professionnelle'
        },
        {
            id: 'independant',
            label: 'Travailleur indépendant ou employeur, y compris exploitant agricole'
        },
        {
            id: 'gerant_salarie',
            label: 'Gérant salarié'
        },
        {
            id: 'demandeur_emploi',
            label: 'Demandeur d\'emploi'
        },
        {
            id: 'etudiant',
            label: 'Étudiant'
        },
        {
            id: 'retraite',
            label: 'Retraité'
        }
    ];

    $scope.individusRef.forEach(function(individuRef) {
        $scope.situationsPro.forEach(function(situationPro) {
            individuRef.situationsPro.push({situation: situationPro.id, label: situationPro.label, selected: false});
        });
    });

    $scope.submit = function() {
        situation.demandeur.situationsPro = _.filter($scope.individusRef[0].situationsPro, 'selected');
        if (situation.conjoint) {
            situation.conjoint.situationsPro = _.filter($scope.individusRef[1].situationsPro, 'selected');
        }

        SituationService.update(situation).then(function() {
            situation.infosComplementairesCaptured = true;
            $state.go('download_cerfa', {cerfa: $stateParams.requestedCerfa});
        });
    };
});
