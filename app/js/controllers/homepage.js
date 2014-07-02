'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, $window, $http, $location, SituationService) {
    $scope.checkConfirmation = function() {
        if (!$scope.acceptConditions) {
            $window.alert('Vous devez cocher la case pour continuer');
            return false;
        }
        return true;
    };

    $scope.startSimulation = function() {
        SituationService.newSituation();
        $location.path('/teaser');
    };
});
