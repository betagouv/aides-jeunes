'use strict';

angular.module('ddsApp').controller('FoyerPatrimoineCtrl', function($scope, patrimoineTypes, SituationService, RessourceService) {
    var patrimoineProperties = _.map(patrimoineTypes, 'id');

    $scope.locals = {
        hasBiensLoues: true,
        hasTerrainsNonLoues: true,
        hasBatisNonLoues: true,
    };

    $scope.periodKey = '2012-01';
    var demandeur = $scope.demandeur = $scope.situation.individus[0];
    patrimoineProperties.forEach(function(patrimoinePropertyName) {
        demandeur[patrimoinePropertyName] = demandeur[patrimoinePropertyName] || {};
        demandeur[patrimoinePropertyName][$scope.periodKey] = demandeur[patrimoinePropertyName][$scope.periodKey] || 0;
    });

    $scope.submit = function() {
        $scope.$emit('patrimoine');
    };
});
