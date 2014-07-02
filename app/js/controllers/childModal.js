'use strict';

angular.module('ddsApp').controller('ChildModalCtrl', function($scope, $modalInstance, modalTitle) {
    $scope.modalTitle = modalTitle;
    $scope.nationalite = 'francaise';

    $scope.submit = function (form) {
        $scope.formSubmitted = true;
        if (form.$valid) {
            $modalInstance.close({
                firstName: $scope.firstName,
                birthDate: $scope.birthDate,
                nationalite: $scope.nationalite
            });
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
