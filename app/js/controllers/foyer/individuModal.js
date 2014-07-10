'use strict';

angular.module('ddsApp').controller('FoyerIndividuModalCtrl', function($scope, $modalInstance, options) {
    $scope.modalTitle = options.modalTitle;
    $scope.nationalite = 'francaise';
    $scope.askFirstName = !!options.askFirstName;
    $scope.cancelable = !!options.cancelable;

    if (true === ($scope.askRelationType = !!options.askRelationType)) {
        $scope.relationType = 'mariage';
    }

    $scope.submit = function(form) {
        $scope.formSubmitted = true;
        if (form.$valid) {
            var individu = {birthDate: $scope.birthDate, nationalite: $scope.nationalite};
            if ($scope.askFirstName) {
                individu.firstName = $scope.firstName;
            }
            if ($scope.askRelationType) {
                individu.relationType = $scope.relationType;
            }

            $scope.$emit('individu.' + options.individuType, individu);
            $modalInstance.close(individu);
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
