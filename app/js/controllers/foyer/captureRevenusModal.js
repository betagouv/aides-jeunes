'use strict';

angular.module('ddsApp').controller('CaptureRevenusModalCtrl', function($scope, $modalInstance, modalTitle, individu) {
    $scope.modalTitle = modalTitle;
    $scope.individu = individu;

    $scope.cleanSelectedRessources = function() {
        for (var i in individu.selectedRessources) {
            if (!individu.selectedRessources[i]) {
                delete individu.selectedRessources[i];
            }
        }
    };

    if (!individu.selectedRessources) {
        individu.selectedRessources = {};
    } else {
        $scope.ressourcesSelected = true;
        $scope.cleanSelectedRessources();
    }

    $scope.initMonths = function() {
        var month1 = moment().subtract('months', 3);
        var month2 = moment().subtract('months', 2);
        var month3 = moment().subtract('months', 1);

        $scope.month1 = month1.format('YYYY-MM');
        $scope.month2 = month2.format('YYYY-MM');
        $scope.month3 = month3.format('YYYY-MM');

        $scope.month1Label = month1.format('MMMM YYYY');
        $scope.month2Label = month2.format('MMMM YYYY');
        $scope.month3Label = month3.format('MMMM YYYY');
    };

    $scope.initMonths();

    $scope.initRevenusFromIndividu = function() {
        $scope.revenus = {};

        // remplissage des cases des types de revenus sélectionnés avec des 0
        for (var ressourceType in individu.selectedRessources) {
            var ressource = $scope.revenus[ressourceType] = {};
            ressource[$scope.month1] = 0;
            ressource[$scope.month2] = 0;
            ressource[$scope.month3] = 0;
        }

        // récupération des éventuelles valeurs rentrées précédemment
        for (var i in individu.ressources) {
            var ressource = individu.ressources[i];
            var revenu = $scope.revenus[ressource.type]
            if (!!revenu && angular.isDefined(revenu[ressource.periode])) {
                revenu[ressource.periode] = ressource.montant;
            }
        }
    };

    $scope.initRevenusFromIndividu();

    $scope.submit = function() {
        if (!$scope.ressourcesSelected) {
            $scope.ressourcesSelected = true;
            $scope.cleanSelectedRessources();
            $scope.mergeRevenusWithNewRessources();
        } else {
            individu.ressources = [];
            for (var ressourceType in $scope.revenus) {
                var montants = $scope.revenus[ressourceType];
                for (var month in montants) {
                    var montant = montants[month];
                    var ressource = {
                        type: ressourceType,
                        periode: month,
                        montant: montant
                    };
                    individu.ressources.push(ressource);
                }
            }
            $modalInstance.close($scope.revenus);
        }
    };

    $scope.mergeRevenusWithNewRessources = function() {
        var previousRevenus = $scope.revenus;
        $scope.revenus = {};

        // remplissage des cases des types de revenus sélectionnés avec des 0
        for (var ressourceType in individu.selectedRessources) {
            var ressource = $scope.revenus[ressourceType] = {};
            ressource[$scope.month1] = 0;
            ressource[$scope.month2] = 0;
            ressource[$scope.month3] = 0;
        }

        // récupération des éventuelles valeurs rentrées précédemment
        for (var i in previousRevenus) {
            var ressource = previousRevenus[i];
            var revenu = $scope.revenus[i];
            if (!!revenu) {
                for (var j in ressource) {
                    var montant = ressource[j];
                    if (angular.isDefined(revenu[j])) {
                        revenu[j] = montant;
                    }
                }
            }
        }
    };

    $scope.sections = [
        {
            name: 'revenusActivite',
            label: 'Revenus d\'activité',
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
