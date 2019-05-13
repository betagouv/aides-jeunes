'use strict';

angular.module('ddsApp').controller('FoyerPatrimoineCtrl', function($scope, patrimoineTypes) {
    var patrimoineProperties = _.map(patrimoineTypes, 'id');

    var historicalKey = '2012-01';
    var periodKey = $scope.periodKey = 'month:2012-01:120';
    var demandeur = $scope.demandeur = $scope.situation.individus[0];
    patrimoineProperties.forEach(function(patrimoinePropertyName) {
        demandeur[patrimoinePropertyName] = demandeur[patrimoinePropertyName] || {};
        demandeur[patrimoinePropertyName][$scope.periodKey] = demandeur[patrimoinePropertyName][$scope.periodKey] ||  demandeur[patrimoinePropertyName][historicalKey] || 0;
    });

    var mapping = {
        hasTerrainsNonLoues: {
            sources: ['valeur_terrains_non_loues', 'valeur_locative_terrains_non_loues'],
        },
        hasBatisNonLoues: {
            sources: ['valeur_immo_non_loue', 'valeur_locative_immo_non_loue'],
        },
    };

    $scope.locals = {
        hasBiensLoues: _.some($scope.situation.individus, function(individu) { return individu.revenus_locatifs; }),
        hasEpargneAuxRevenusImposables: _.some($scope.situation.individus, function(individu) { return individu.revenus_capital; }),
    };

    var localKeys = Object.keys(mapping);
    localKeys.forEach(function(keyName) {
        $scope.locals[keyName] = false;
        mapping[keyName].sources.forEach(function(attributeName) {
            $scope.locals[keyName] = $scope.locals[keyName] || $scope.demandeur[attributeName][periodKey];
        });

        $scope.$watch('locals.' + keyName, function(newValue) {
            if (newValue) {
                return;
            }

            mapping[keyName].sources.forEach(function(attributeName) {
                $scope.demandeur[attributeName][periodKey] = 0;
            });
        });
    });

    $scope.submit = function() {
        $scope.$emit('patrimoine');
    };
});
