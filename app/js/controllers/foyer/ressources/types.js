'use strict';

angular.module('ddsApp').controller('FoyerRessourceTypesCtrl', function($scope) {
    $scope.submit = function() {
        $scope.$emit('ressourceTypesValidated');
    };
});
