'use strict';

angular.module('ddsApp').controller('FoyerCaptureRevenusModalCtrl', function($scope, $rootScope, $modalInstance, individus, SituationService) {
    $scope.sections = SituationService.revenusSections;
    $scope.sections[0].open = true;

    $scope.individuRefs = _.map(individus, function(individu) {
        return {
            label: SituationService.individuLabel(individu),
            selectedRessources: {},
            ressources: [],
            individu: individu
        };
    });

    $scope.months = SituationService.getMonths();

    $scope.submit = function() {
        var closeModal = true;
        if (!$scope.ressourcesSelected) {
            $scope.ressourcesSelected = true;
            $scope.initIndividusRessources();
            closeModal = !$scope.hasRessources();
        }

        if (closeModal) {
            $scope.applyIndividuRefsRessourcesToIndividus();
            $rootScope.$broadcast('ressourcesCaptured');
            $modalInstance.close();
        }
    };

    $scope.hasIndividuRessources = function(individuRef) {
        var selectedRessources = _.filter(individuRef.selectedRessources);
        return !!_.values(selectedRessources).length;
    };

    $scope.hasRessources = function() {
        var result = false;
        $scope.individuRefs.forEach(function(individuRef) {
            result = result || $scope.hasIndividuRessources(individuRef);
        });

        return result;
    };

    $scope.initIndividusRessources = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            $scope.orderedSubsections.forEach(function(subsection) {
                if (individuRef.selectedRessources[subsection.name]) {
                    individuRef.ressources.push({
                        type: subsection.name,
                        months: [
                            { periode: $scope.months[0].id, montant: 0},
                            { periode: $scope.months[1].id, montant: 0},
                            { periode: $scope.months[2].id, montant: 0}
                        ]
                    });
                }
            });
        });
    };

    $scope.applyIndividuRefsRessourcesToIndividus = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            var individu = individuRef.individu;
            individu.ressources = [];
            individuRef.ressources.forEach(function(ressource) {
                ressource.months.forEach(function(month) {
                    individu.ressources.push({
                        periode: month.periode,
                        type: ressource.type,
                        montant: month.montant
                    });
                });
            });
        });
    };

    $scope.subsectionsIndex = {};
    $scope.orderedSubsections = [];
    $scope.sections.forEach(function(section) {
        section.subsections.forEach(function(subsection) {
            subsection.section = section;
            $scope.subsectionsIndex[subsection.name] = subsection;
            $scope.orderedSubsections.push(subsection);
        });
    });
});
