'use strict';

angular.module('acceptanceTests').controller('LoginCtrl', function($scope, $state, $stateParams, $window, $timeout, UserService) {
    if (UserService.user()) {
        $state.go('index.list');
    }

    $scope.submit = function() {
        $scope.waiting = true;
        $scope.badCredentials = false;
        UserService.login($scope.email, $scope.password)
            .then(function() {
                if ($stateParams.targetUrl) {
                    $window.location.pathname = $stateParams.targetUrl;
                } else {
                    $state.go('index.list');
                }
            }).catch(function() {
                $scope.badCredentials = true;
                $scope.waiting = false;
            });
    };
});
