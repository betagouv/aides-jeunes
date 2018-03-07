'use strict';

angular.module('ddsApp').controller('FoyerPatrimoineCtrl', function($scope, patrimoineTypes, SituationService, RessourceService) {
    var patrimoineProperties = _.map(patrimoineTypes, 'id');

    var periodKey = $scope.periodKey = '2012-01';
    var demandeur = $scope.demandeur = $scope.situation.individus[0];
    patrimoineProperties.forEach(function(patrimoinePropertyName) {
        demandeur[patrimoinePropertyName] = demandeur[patrimoinePropertyName] || {};
        demandeur[patrimoinePropertyName][$scope.periodKey] = demandeur[patrimoinePropertyName][$scope.periodKey] || 0;
    });

    $scope.locals = {
        hasBiensLoues: _.some($scope.situation.individus, function(individu) { return individu.revenus_locatifs; }),
        hasTerrainsNonLoues: $scope.demandeur.valeur_terrains_non_loues[periodKey] || $scope.demandeur.valeur_locative_terrains_non_loues[periodKey],
        hasBatisNonLoues: true,
    };

    $scope.submit = function() {
        $scope.$emit('patrimoine');
    };
});
