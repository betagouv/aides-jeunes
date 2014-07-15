'use strict';

angular.module('ddsApp').controller('CaptureRevenusModalCtrl', function($scope, $modalInstance, SituationService) {
    var situation = SituationService.restoreLocal();
    $scope.sections = SituationService.revenusSections;
    $scope.sections[0].open = true;
    $scope.individus = SituationService.createIndividusList();

    // suppression des clés dont la valeur est "false"
    $scope.cleanSelectedRessources = function() {
        for (var i in $scope.selectedRessourcesMap) {
            if (!$scope.selectedRessourcesMap[i]) {
                delete $scope.selectedRessourcesMap[i];
            }
        }
    };

    // on recrée l'array de type de ressources sélectionnées pour ordonner correctement
    $scope.updateSelectedRessources = function() {
        $scope.selectedRessources = [];
        for (var i in $scope.sections) {
            var section = $scope.sections[i];
            for (var j in section.subsections) {
                var subsection = section.subsections[j];
                if ($scope.selectedRessourcesMap[subsection.name]) {
                    $scope.selectedRessources.push(subsection.name);
                }
            }
        }
    };

    if (!$scope.selectedRessourcesMap) {
        $scope.selectedRessourcesMap = {};
    } else {
        $scope.ressourcesSelected = true;
        $scope.cleanSelectedRessources();
        $scope.updateSelectedRessources();
    }

    $scope.initMonths = function() {
        $scope.months = [];
        for (var i = 3; i > 0; i--) {
            var date = moment().subtract('months', i);
            var month = {
                id: date.format('YYYY-MM'),
                label: date.format('MMMM YYYY')
            };
            $scope.months.push(month);
        }
    };

    $scope.initMonths();

    $scope.zerofillRevenus = function() {
        $scope.revenus = {};
        // remplissage des cases des types de revenus sélectionnés avec des 0
        for (var ressourceType in $scope.selectedRessourcesMap) {
            var ressource = $scope.revenus[ressourceType] = {};
            for (var i in $scope.months) {
                ressource[$scope.months[i].id] = 0;
            }
        }
    };

    $scope.initRevenusFromIndividu = function() {
        $scope.zerofillRevenus();
        // récupération des éventuelles valeurs rentrées précédemment
        for (var i in $scope.ressources) {
            var ressource = $scope.ressources[i];
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
            $scope.ressources = [];
            for (var ressourceType in $scope.revenus) {
                var montants = $scope.revenus[ressourceType];
                for (var month in montants) {
                    var montant = montants[month];
                    var ressource = {
                        type: ressourceType,
                        periode: month,
                        montant: montant
                    };
                    $scope.ressources.push(ressource);
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
