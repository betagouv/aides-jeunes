'use strict';

angular.module('ddsBackend').controller('LoginCtrl', function($scope, $location, UserService) {
    $scope.badCredentials = false;
    $scope.email = 'jerome.desboeufs@gmail.com';
    $scope.password = 'sgmap2014';

    $scope.connect = function() {
        $scope.badCredentials = false;
        UserService.authenticate($scope.email, $scope.password)
            .then(function() {
                $location.path('/');
            }, function() {
                $scope.password = '';
                $scope.badCredentials = true;
            });
    };
});
