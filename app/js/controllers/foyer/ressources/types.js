'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope) {
    _.chain($scope.situation.individus)
        .flatten('ressources')
        .filter()
        .uniq(false, 'type')
        .pluck('type')
        .forEach(function(ressourceType) { $scope.selectedRessourceTypes[ressourceType] = true; });

    $scope.submit = function() {
        $scope.$emit('ressourceTypesValidated');
    };
});
