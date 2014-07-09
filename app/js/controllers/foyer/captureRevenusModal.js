'use strict';

angular.module('ddsApp').controller('CaptureRevenusModalCtrl', function($scope, $modalInstance, modalTitle, individu) {
    $scope.modalTitle = modalTitle;
    $scope.individu = individu;

    if (!individu.selectedRessources) {
        individu.selectedRessources = {};
    }

    $scope.submit = function() {
        if (!individu.ressources) {
            individu.ressources = [];
            for (var i in individu.selectedRessources) {
                individu.ressources.push(new Array(3));
            }
        } else {
            $modalInstance.close();
        }
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
                    label: 'Allocation chômage'
                }, {
                    name: 'allocationLogement',
                    label: 'Allocation logement'
                }, {
                    name: 'rsa',
                    label: 'Revenu de solidarité active'
                }, {
                    name: 'aspa',
                    label: 'Allocation de solidarité aux personnes âgées'
                }, {
                    name: 'ass',
                    label: 'Allocation de solidarité spécifique'
                }
            ]
        },
        {
            name: 'indemnites',
            label: 'Indemnités',
            subsections: [
                {
                    name: 'indJourMaternite',
                    label: 'Indemnités de maternité'
                }, {
                    name: 'indJourPaternite',
                    label: 'Indemnités de paternité'
                }, {
                    name: 'indJourAdoption',
                    label: 'Indemnités d\'adoption'
                }, {
                    name: 'indJourMaladie',
                    label: 'Indemnités maladie'
                }, {
                    name: 'indJourMaladieProf',
                    label: 'Indemnités maladie professionnelle'
                }, {
                    name: 'indJourAccidentDuTravail',
                    label: 'Indemnités accident du travail'
                }, {
                    name: 'indChomagePartiel',
                    label: 'Indemnités de chômage partiel'
                }
            ]
        },
        {
            name: 'pensions',
            label: 'Pensions',
            subsections: [
                {
                    name: 'pensionsAlimentaires',
                    label: 'Pensions alimentaires'
                }, {
                    name: 'pensionsRetraitesRentes',
                    label: 'Retraites, rentes'
                }
            ]
        }
    ];

    $scope.subsectionsIndex = {};
    for (var i in $scope.sections) {
        var section = $scope.sections[i];
        for (var j in section.subsections) {
            var subsection = section.subsections[j];
            subsection.section = section;
            $scope.subsectionsIndex[subsection.name] = subsection;
        }
    }
});
