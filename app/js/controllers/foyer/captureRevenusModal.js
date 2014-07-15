'use strict';

angular.module('ddsApp').controller('CaptureRevenusModalCtrl', function($scope, $modalInstance, SituationService) {
    var situation = SituationService.restoreLocal();
    $scope.sections = SituationService.revenusSections;
    $scope.sections[0].open = true;
    $scope.individus = SituationService.createIndividusList();

    $scope.selectedRessourcesMap = {};
    $scope.selectedRessourcesByIndividu = {};
    for (var i in $scope.individus) {
        $scope.selectedRessourcesByIndividu[$scope.individus[i].name] = {};
    }

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

    // initialisation des mois
    // FIXME prendre la date du serveur
    $scope.months = [];
    for (var i = 3; i > 0; i--) {
        var date = moment().subtract('months', i);
        var month = {
            id: date.format('YYYY-MM'),
            label: date.format('MMMM YYYY')
        };
        $scope.months.push(month);
    }

    $scope.hasIndividuRevenus = function(individu) {
        return _.keys($scope.selectedRessourcesByIndividu[individu.name]).length > 0;
    };

    $scope.submit = function() {
        if (!$scope.ressourcesSelected) {
            $scope.ressourcesSelected = true;
            $scope.cleanSelectedRessources();
            $scope.zerofillRevenus();
        } else {
            $modalInstance.close();
        }
    };

    $scope.zerofillRevenus = function() {
      _.forEach($scope.individus, function(individu) {
            individu.ressources = {};
            _.forEach($scope.orderedSubsections, function(subsection) {
                if ($scope.selectedRessourcesByIndividu[individu.name][subsection.name]) {
                    individu.ressources[subsection.name] = {};
                    _.forEach($scope.months, function(month) {
                        individu.ressources[subsection.name][month.id] = 0;
                    });
                }
            });
        });
    }

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
