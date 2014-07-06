'use strict';

angular.module('ddsApp').controller('CaptureRevenusModalCtrl', function($scope, $modalInstance, modalTitle) {
    $scope.modalTitle = modalTitle;
    $scope.submit = function() {
        $modalInstance.close();
    };

    $scope.sections = [
        {
            name: 'revenusActivite',
            label: 'Revenus d\'activité',
            open: true,
            subsections: [
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
            subsections: [
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
            subsections: [
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
            subsections: [
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

    $scope.selectedSubsections = {};
});
