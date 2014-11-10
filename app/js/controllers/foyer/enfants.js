'use strict';

angular.module('ddsApp').controller('FoyerEnfantsCtrl', function($scope) {
    $scope.enfants = [];

    $scope.$on('individu.enfant', function(e, enfant) {
        $scope.enfants.push(enfant);
        $scope.ajoutEnfant = false;
    });

    $scope.removeEnfant = function(enfant) {
        var index = $scope.enfants.indexOf(enfant);
        $scope.enfants.splice(index, 1);
    };

    $scope.validate = function() {
        $scope.$emit('enfants', $scope.enfants);
    };
});
