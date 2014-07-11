'use strict';

angular.module('ddsApp').controller('CaptureRevenusModalCtrl', function($scope, $modalInstance, modalTitle, individu, SituationService) {
    $scope.modalTitle = modalTitle;
    $scope.individu = individu;
    $scope.sections = SituationService.revenusSections;
    $scope.sections[0].isOpen = true;

    $scope.cleanSelectedRessources = function() {
        for (var i in individu.selectedRessources) {
            if (!individu.selectedRessources[i]) {
                delete individu.selectedRessources[i];
            }
        }
    };

    $scope.updateSelectedRessources = function() {
        $scope.selectedRessources = [];
        for (var i in $scope.sections) {
            var section = $scope.sections[i];
            for (var j in section.subsections) {
                var subsection = section.subsections[j];
                if (individu.selectedRessources[subsection.name]) {
                    $scope.selectedRessources.push(subsection.name);
                }
            }
        }
    };

    if (!individu.selectedRessources) {
        individu.selectedRessources = {};
    } else {
        $scope.ressourcesSelected = true;
        $scope.cleanSelectedRessources();
        $scope.updateSelectedRessources();
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

    $scope.zerofillRevenus = function() {
        $scope.revenus = {};
        // remplissage des cases des types de revenus sélectionnés avec des 0
        for (var ressourceType in individu.selectedRessources) {
            var ressource = $scope.revenus[ressourceType] = {};
            ressource[$scope.month1] = 0;
            ressource[$scope.month2] = 0;
            ressource[$scope.month3] = 0;
        }
    };

    $scope.initRevenusFromIndividu = function() {
        $scope.zerofillRevenus();
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
            $scope.updateSelectedRessources();
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
        $scope.zerofillRevenus();

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
