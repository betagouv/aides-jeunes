'use strict';

angular.module('ddsApp').controller('ConjointModalCtrl', function($scope, $modalInstance, individuType) {
    var modalTitles = {
        demandeur: 'Vous',
        conjoint: 'Votre conjoint'
    };
    $scope.modalTitle = modalTitles[individuType];

    if ('conjoint' === individuType) {
        $scope.askRelationType = true;
        $scope.relationType = 'mariage';
    }

    $scope.nationalite = 'francaise';

    $scope.submit = function(form) {
        $scope.formSubmitted = true;
        if (form.$valid) {
            var result = {birthDate: $scope.birthDate, nationalite: $scope.nationalite};
            if ('conjoint' === individuType) {
                result.relationType = $scope.relationType;
            }
            $modalInstance.close(result);
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
