'use strict';

angular.module('ddsApp').controller('RevenusAidesCtrl', function($scope, SituationService) {
    $scope.sections = [
        {
            name: 'revenusActivite',
            label: 'Revenus d\'activité',
            open: true,
            subSections: [
                {
                    name: 'revenusSalarie',
                    label: 'Salaires'
                }, {
                    name: 'revenusNonSalarie',
                    label: 'Revenus non-salarié'
                }, {
                    name: 'revenusAutoEntrepreneur',
                    label: 'Revenus auto-entrepreneur'
                },
            ]
        },
        {
            name: 'allocations',
            label: 'Allocations',
            subSections: [
                {
                    name: 'allocationsChomage',
                    label: 'Chômage'
                }, {
                    name: 'allocationLogement',
                    label: 'Logement'
                }, {
                    name: 'rsa',
                    label: 'Revenu de Solidarité Active'
                }, {
                    name: 'aspa',
                    label: 'Solidarité aux personnes âgées'
                }, {
                    name: 'ass',
                    label: 'Solidarité spécifique'
                }
            ]
        },
        {
            name: 'indemnites',
            label: 'Indemnités',
            subSections: [
                {
                    name: 'indJourMaternite',
                    label: 'Maternité'
                }, {
                    name: 'indJourPaternite',
                    label: 'Paternité'
                }, {
                    name: 'indJourAdoption',
                    label: 'Adoption'
                }, {
                    name: 'indJourMaladie',
                    label: 'Maladie'
                }, {
                    name: 'indJourMaladieProf',
                    label: 'Maladie professionnelle'
                }, {
                    name: 'indJourAccidentDuTravail',
                    label: 'Accident du travail'
                }, {
                    name: 'indChomagePartiel',
                    label: 'Chômage partiel'
                }
            ]
        },
        {
            name: 'pensions',
            label: 'Pensions',
            subSections: [
                {
                    name: 'pensionsAlimentaires',
                    label: 'Alimentaires'
                }, {
                    name: 'pensionsRetraitesRentes',
                    label: 'Retraites, rentes'
                }
            ]
        }
    ];

    $scope.situation = SituationService.restoreLocal();
    $scope.individus = SituationService.createIndividusList($scope.situation);
    _.forEach($scope.individus, function(individu) {
        individu.hasResources = {};
    });
});
