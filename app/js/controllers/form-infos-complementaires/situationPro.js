'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesSituationProCtrl', function($scope, $state, $stateParams, situation, SituationService) {
    $scope.situation = situation;

    $scope.individus = [{id: 'demandeur', label: 'Vous'}];

    if (situation.conjoint) {
        $scope.individus.push({id: 'conjoint', label: 'Votre partenaire'});
    }

    $scope.selectedSituations = {};
    $scope.datesSelectedSituations = {};
    $scope.salarieContractTypes = {};
    $scope.isStagiaireRemunere = {};

    $scope.individus.forEach(function(individu) {
        $scope.selectedSituations[individu.id] = {};
        $scope.datesSelectedSituations[individu.id] = {};
    });

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
            id: 'etudiant',
            label: 'Étudiant'
        },
        {
            id: 'retraite',
            label: 'Retraité'
        }
    ];

    $scope.submit = function() {
        $scope.individus.forEach(function(individu) {
            var situations = situation[individu.id].situationsPro = [];
            _.forEach($scope.selectedSituations[individu.id], function(selected, situationPro) {
                if (selected) {
                    var situationToAppend = {situation: situationPro, since: $scope.datesSelectedSituations[individu.id][situationPro]};
                    if ('salarie' === situationPro) {
                        situationToAppend.contractType = $scope.salarieContractTypes[individu.id];
                    } else if ('stagiaire' === situationPro) {
                        situationToAppend.isRemunere = $scope.isStagiaireRemunere[individu.id];
                    }
                    situations.push(situationToAppend);
                }
            });
        });

        SituationService.update(situation).then(function() {
            $state.go('resultat', {situationId: situation._id, requestedCerfa: $stateParams.requestedCerfa});
        });
    };
});
