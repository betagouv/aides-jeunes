'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesSituationProCtrl', function($scope, $state, $stateParams, situation, SituationService) {
    $scope.situation = situation;

    $scope.individus = [{id: 'demandeur', label: 'Vous'}];
    if (situation.conjoint) {
        $scope.individus.push({id: 'conjoint', label: 'Votre partenaire'});
    }

    $scope.selectedSituations = {};
    $scope.datesSelectedSituations = {};
    $scope.individus.forEach(function(individu) {
        $scope.selectedSituations[individu.id] = {};
        $scope.datesSelectedSituations[individu.id] = {};
    });

    $scope.isActiviteCesseeVolontairement = {};
    $scope.salarieContractTypes = {};
    $scope.isStagiaireRemunere = {};
    $scope.gerantSalarieAffiliation = {};
    $scope.isChomeurIndemnise = {};
    $scope.chomeurIndemniseSince = {};

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

    $scope.submit = function() {
        $scope.individus.forEach(function(individu) {
            var situationsPro = situation[individu.id].situationsPro = [];
            _.forEach($scope.selectedSituations[individu.id], function(selected, situationPro) {
                if (selected) {
                    var situationToAppend = {situation: situationPro, since: $scope.datesSelectedSituations[individu.id][situationPro]};
                    if ('sans_activite' === situationPro) {
                        situationToAppend.volontairementSansActivite = $scope.isActiviteCesseeVolontairement[individu.id];
                    } else if ('salarie' === situationPro) {
                        situationToAppend.contractType = $scope.salarieContractTypes[individu.id];
                    } else if ('stagiaire' === situationPro) {
                        situationToAppend.isRemunere = $scope.isStagiaireRemunere[individu.id];
                    } else if ('gerant_salarie' === situationPro) {
                        situationToAppend.gerantSalarieAffiliation = $scope.gerantSalarieAffiliation[individu.id];
                    } else if ('demandeur_emploi' === situationPro) {
                        situationToAppend.isIndemnise = $scope.isChomeurIndemnise[individu.id];
                        if (situationToAppend.isIndemnise) {
                            situationToAppend.indemniseSince = $scope.chomeurIndemniseSince[individu.id];
                        }
                    }
                    situationsPro.push(situationToAppend);
                }
            });
        });

        SituationService.update(situation).then(function() {
            $state.go('resultat', {situationId: situation._id, requestedCerfa: $stateParams.requestedCerfa});
        });
    };
});
