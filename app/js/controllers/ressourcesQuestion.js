'use strict';

angular.module('ddsApp').controller('RessourcesQuestionCtrl', function ($scope) {
    $scope.periodes = situation.troisDerniersMois();
    $scope.moment = moment;
    $scope._s = _s;

    $scope.sections = [
        { name: 'revenusActivite', label: 'Revenus d\'activité', pos: 1 },
        { name: 'allocations', label: 'Allocations', pos: 2 },
        { name: 'indemnites', label: 'Indemnités', pos: 3 },
        { name: 'pensions', label: 'Pensions', pos: 4 }
    ];

    function updateIndividu() {
        $scope.individu = $scope.targetEntity;
        $scope.individu.construitTroisDerniersMois();
        $scope.selecting = true;
        $scope.ressourcesSelected = {};

        $scope.ressourcesParSection = _.groupBy(situation.Individu.ressources, 'section');
        $scope.ressources = situation.Individu.ressources;

        $scope.ressourcesCount = 0;
    }

    $scope.selectRessource = function(ressource) {
        $scope.ressourcesSelected[ressource] = true;
        _.forEach($scope.periodes, function(periode) {
            $scope.individu.ressources[periode][ressource] = 0;
        });
        $scope.ressourcesCount++;
    };

    $scope.removeRessource = function(ressource) {
        delete $scope.ressourcesSelected[ressource];
        _.forEach($scope.periodes, function(periode) {
            delete $scope.individu.ressources[periode][ressource];
        });
        $scope.ressourcesCount--;
    };

    updateIndividu();

    $scope.$watch('targetEntity', updateIndividu);
});
