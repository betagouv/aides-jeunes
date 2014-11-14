'use strict';

angular.module('ddsApp').controller('FoyerRessourcePersonnesCtrl', function($scope) {
    $scope.isRessourceSelected = function(ressourceType) {
        return !!$scope.selectedRessourceTypes[ressourceType.id];
    };

    $scope.submit = function() {
        $scope.$emit('selectedPersonnes');
    };
});
