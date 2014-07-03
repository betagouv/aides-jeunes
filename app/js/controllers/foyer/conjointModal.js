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
            var individu = {birthDate: $scope.birthDate, nationalite: $scope.nationalite};
            if ('conjoint' === individuType) {
                individu.relationType = $scope.relationType;
            }
            $scope.$emit('individu.' + individuType, individu);
            $modalInstance.close(individu);
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
