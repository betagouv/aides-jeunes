'use strict';

angular.module('ddsApp').controller('FoyerPensionsAlimentairesCtrl', function($scope) {
    $scope.recoitPensionsAlimentaires = false;
    $scope.versePensionsAlimentaires = false;

    $scope.submit = function() {
        $scope.$emit('pensionsAlimentaires');
    };
});
