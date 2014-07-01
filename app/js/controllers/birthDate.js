'use strict';

angular.module('ddsApp').controller('BirthDateCtrl', function ($scope, $location, SituationService) {
    $scope.submit = function() {
        $scope.formSubmitted = true;
        if ($scope.form.$invalid) {
            $scope.invalidDate = true;
            return;
        }

        SituationService.saveLocal({demandeur: {birthDate: $scope.birthDate}})
        $location.path('/configuration/foyer');
    };
});
