'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesSituationProCtrl', function($scope, $state, $stateParams, situation, SituationService) {
    $scope.situation = situation;

    $scope.individusRef = [{id: 'demandeur', label: 'Vous', individu: situation.demandeur, situationsPro: []}];
    if (situation.conjoint) {
        $scope.individusRef.push({id: 'conjoint', label: 'Votre partenaire', individu: situation.conjoint, situationsPro: []});
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
            var situationProIndividu = _.find(individuRef.individu.situationsPro, {situation: situationPro.id});
            if (situationProIndividu) {
                situationProIndividu.selected = true;
                individuRef.situationsPro.push(situationProIndividu);
            } else {
                individuRef.situationsPro.push({situation: situationPro.id, label: situationPro.label, selected: false});
            }
        });
    });

    $scope.submit = function() {
        $scope.individusRef.forEach(function(individuRef) {
            individuRef.individu.situationsPro = _.filter(individuRef.situationsPro, 'selected');
        });

        SituationService.update(situation).then(function() {
            situation.infosComplementairesCaptured = true;
            $state.go('download_cerfa', {droit: $stateParams.droit});
        });
    };
});
