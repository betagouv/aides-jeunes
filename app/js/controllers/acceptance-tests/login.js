'use strict';

angular.module('acceptanceTests').controller('LoginCtrl', function($scope, $state, UserService) {
    $scope.submit = function() {
        $scope.waiting = true;
        $scope.badCredentials = false;
        UserService.login($scope.email, $scope.password)
            .then(function() {
                $state.go('index');
            }).catch(function(e) {
                $scope.badCredentials = true;
                $scope.waiting = false;
            });
    };
});
