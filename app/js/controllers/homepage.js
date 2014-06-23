'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, $window, $http, $location) {
    $scope.checkConfirmation = function() {
        if (!$scope.acceptConditions) {
            $window.alert('Vous devez cocher la case pour continuer');
            return false;
        }
        return true;
    };

    $scope.startSimulation = function() {
        $http.post('/api/situations').success(function(situationId) {
            $location.path('/configuration/' + situationId);
        });
    };
});
