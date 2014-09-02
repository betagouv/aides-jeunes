'use strict';

angular.module('ddsApp').controller('FoyerRecapRessourcesCtrl', function($scope, SituationService) {
    $scope.months = SituationService.getMonths();
    $scope.individuLabel = SituationService.individuLabel;

    $scope.initRessources = function() {
        $scope.tempRessources = {};
        $scope.hasRessources = false;
        $scope.globalAmount = 0;

        var individus = SituationService.createIndividusList($scope.situation);
        individus.map($scope.fillIndividuRessources);

        if ($scope.globalAmount > 0) {
            $scope.hasRessources = true;
        }

        $scope.ressources = [];
        SituationService.revenusSections.forEach(function(section) {
            section.subsections.forEach(function(subsection) {
                if ($scope.tempRessources[subsection.name]) {
                    $scope.ressources.push({
                        type: subsection.label,
                        category: section.name,
                        total: $scope.tempRessources[subsection.name].total,
                        byIndividu: $scope.tempRessources[subsection.name].byIndividu
                    });
                }
            });
        });
    };

    $scope.fillIndividuRessources = function(individu) {
        var monthsIndexes = {};
        monthsIndexes[$scope.months[0].id] = 0;
        monthsIndexes[$scope.months[1].id] = 1;
        monthsIndexes[$scope.months[2].id] = 2;

        individu.ressources.forEach(function(ressource) {
            var ressourceSection = $scope.tempRessources[ressource.type];
            if (!ressourceSection) {
                ressourceSection = $scope.tempRessources[ressource.type] = {
                    total: [0, 0, 0],
                    byIndividu: []
                };
            }

            var individuRessource = _.find($scope.tempRessources[ressource.type].byIndividu, { label: SituationService.individuLabel(individu) });
            if (!individuRessource) {
                individuRessource = {
                    label: SituationService.individuLabel(individu),
                    values: []
                };
                $scope.tempRessources[ressource.type].byIndividu.push(individuRessource);
            }

            var monthIndex = monthsIndexes[ressource.periode];
            individuRessource.values[monthIndex] = ressource.montant;
            $scope.tempRessources[ressource.type].total[monthIndex] += ressource.montant;
            $scope.globalAmount += ressource.montant;
        });
    };

    if ($scope.situation.ressourcesCaptured) {
        $scope.initRessources();
    }

    $scope.$on('ressourcesCaptured', function() {
        $scope.situation.ressourcesCaptured = true;
        $scope.initRessources();
    });
});
