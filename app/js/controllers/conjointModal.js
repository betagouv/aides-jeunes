'use strict';

angular.module('ddsApp').controller('ConjointModalCtrl', function($scope, $modalInstance) {
    $scope.lien = 0;

    $scope.submit = function (form) {
        $scope.formSubmitted = true;
        if (form.$valid) {
            $modalInstance.close({ birthDate: $scope.birthDate, lien: $scope.lien });
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
