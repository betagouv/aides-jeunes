'use strict';

angular.module('ddsBackend').controller('HeaderCtrl', function ($scope, $location, UserService) {
    $scope.user = UserService.getUser();
    $scope.logout = function() {
        UserService.logout();
        $scope.user = null;
        $location.path('/login');
    };

    $scope.$on('userLoggedIn', function(event, user) {
        $scope.user = user;
    });
});
