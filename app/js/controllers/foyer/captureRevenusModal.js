'use strict';

angular.module('ddsApp').controller('CaptureRevenusModalCtrl', function($scope, $modalInstance, SituationService) {
    SituationService.restoreLocal();
    $scope.sections = SituationService.revenusSections;
    $scope.sections[0].open = true;
    $scope.individus = SituationService.createIndividusList();

    $scope.selectedRessourcesMap = {};
    $scope.selectedRessourcesByIndividu = {};
    _.forEach($scope.individus, function(individu) {
        $scope.selectedRessourcesByIndividu[individu.name] = {};
    });

    // suppression des clés dont la valeur est "false" dans la map de sélection par individu
    $scope.cleanSelectedRessources = function() {
        _.forEach($scope.selectedRessourcesByIndividu, function(value) {
            _.forEach(value, function(v, k) {
                if (!v) {
                    delete value[k];
                }
            });
        });
    };

    $scope.createOrderedSelectedRessources = function() {
        $scope.orderedSelectedRessources = {};
        _.forEach($scope.selectedRessourcesByIndividu, function(selection, individuName) {
            var ressources = $scope.orderedSelectedRessources[individuName] = [];
            _.forEach($scope.orderedSubsections, function(subsection) {
                if ($scope.selectedRessourcesByIndividu[individuName][subsection.name]) {
                    ressources.push(subsection.name);
                }
            });
        });
    };

    $scope.months = SituationService.getMonths();

    $scope.hasIndividuRevenus = function(individu) {
        return _.keys($scope.selectedRessourcesByIndividu[individu.name]).length > 0;
    };

    $scope.submit = function() {
        if (!$scope.ressourcesSelected) {
            $scope.ressourcesSelected = true;
            $scope.cleanSelectedRessources();
            $scope.zerofillRevenus();
            $scope.createOrderedSelectedRessources();
        } else {
            $modalInstance.close();
        }
    };

    $scope.zerofillRevenus = function() {
        _.forEach($scope.individus, function(individu) {
            individu.individu.ressources = {};
            _.forEach($scope.orderedSubsections, function(subsection) {
                if ($scope.selectedRessourcesByIndividu[individu.name][subsection.name]) {
                    individu.individu.ressources[subsection.name] = {};
                    _.forEach($scope.months, function(month) {
                        individu.individu.ressources[subsection.name][month.id] = 0;
                    });
                }
            });
        });
    };

    $scope.subsectionsIndex = {};
    $scope.orderedSubsections = [];
    _.forEach($scope.sections, function(section) {
        _.forEach(section.subsections, function(subsection) {
            subsection.section = section;
            $scope.subsectionsIndex[subsection.name] = subsection;
            $scope.orderedSubsections.push(subsection);
        });
    });
});
