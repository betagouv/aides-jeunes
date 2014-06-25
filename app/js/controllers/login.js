'use strict';

angular.module('ddsBackend').controller('LoginCtrl', function($scope, UserService) {
    $scope.badCredentials = false;
    $scope.username = 'test@test.com';
    $scope.password = 'coucou';

    $scope.connect = function() {
        $scope.badCredentials = false;
        UserService.authenticate($scope.username, $scope.password)
            .then(function() {
                $location.path('/');
            }, function() {
                $scope.password = '';
                $scope.badCredentials = true;
            });
    };
});
