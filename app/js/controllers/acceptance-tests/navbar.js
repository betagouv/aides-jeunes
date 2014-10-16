'use strict';

angular.module('acceptanceTests').controller('NavbarCtrl', function($scope, $state, UserService) {
    $scope.navbarCollapsed = true;

    var setEmail = function() {
        var user = UserService.user();
        if (user) {
            $scope.email = user.email;
        }
    };

    setEmail();
    $scope.$on('userLoggedIn', function() {
        setEmail();
    });
    $scope.$on('userLoggedOut', function() {
        $scope.email = null;
    });

    $scope.logout = function() {
        UserService.logout().then(function() {
            $state.go('login');
        });
    };
});
