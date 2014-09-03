'use strict';

angular.module('ddsApp').controller('FoyerCaptureRevenusModalCtrl', function($scope, $rootScope, $modalInstance, individus, SituationService) {
    $scope.sections = SituationService.revenusSections;
    $scope.orderedSubsections = [];
    $scope.sections.forEach(function(section) {
        section.subsections.forEach(function(subsection) {
            subsection.section = section;
            $scope.orderedSubsections.push(subsection);
        });
    });

    $scope.months = SituationService.getMonths();
    var lastMonth = moment().subtract('months', 1).startOf('month');
    $scope.lastMonth = lastMonth.format('MMMM YYYY');
    var lastYear = lastMonth.subtract('years', 1).add('months', 1);
    $scope.lastYear = lastYear.format('MMMM YYYY');
    $scope.selectedRessources = {};

    $scope.individuRefs = _.map(individus, function(individu) {
        return {
            label: SituationService.individuLabel(individu),
            selectedRessources: {},
            ressources: [],
            individu: individu
        };
    });

    $scope.previousStep = function() {
        if ($scope.personnesSelected) {
            $scope.personnesSelected = false;
            if (1 === $scope.individuRefs.length) {
                $scope.ressourcesSelected = false;
            }
        } else {
            $scope.ressourcesSelected = false;
        }
    };

    $scope.submit = function() {
        var closeModal = true;
        if (!$scope.ressourcesSelected) {
            $scope.ressourcesSelected = true;
            closeModal = !_.filter($scope.selectedRessources).length;
            // cas particulier si le demandeur est seul : on bypass l'écran intermédiaire de sélection des personnes
            if (1 === $scope.individuRefs.length) {
                $scope.individuRefs[0].selectedRessources = $scope.selectedRessources;
                $scope.personnesSelected = true;
                $scope.initIndividusRessources();
            }
        } else if (!$scope.personnesSelected) {
            $scope.personnesSelected = true;
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
            _.forEach(individuRef.selectedRessources, function(selected, type) {
                if (!$scope.selectedRessources[type]) {
                    individuRef.selectedRessources[type] = false;
                }
            });

            individuRef.ressources = _.filter(individuRef.ressources, function(ressource) {
                return !!individuRef.selectedRessources[ressource.type.name];
            });

            var previousRessources = individuRef.ressources;
            individuRef.ressources = [];
            $scope.orderedSubsections.forEach(function(subsection) {
                if (individuRef.selectedRessources[subsection.name]) {
                    var ressource = _.find(previousRessources, {type: subsection.name});
                    if (!ressource) {
                        ressource = {
                            type: subsection,
                            months: [
                                { periode: $scope.months[0].id, montant: 0 },
                                { periode: $scope.months[1].id, montant: 0 },
                                { periode: $scope.months[2].id, montant: 0 }
                            ],
                            year: {
                                montant: 0
                            }
                        };
                    }
                    individuRef.ressources.push(ressource);
                }
            });
        });
    };

    $scope.updateYearAmount = function(ressource) {
        var montants = _.map(ressource.months, function(month) {
            return month.montant;
        });
        ressource.year.montant = 4 * _.reduce(montants, function(sum, num) {
            return sum + num;
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
                        type: ressource.type.name,
                        montant: month.montant
                    });
                });
            });
        });
    };
});
