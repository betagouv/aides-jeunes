'use strict';

angular.module('acceptanceTests').controller('UsersCtrl', function($scope, $http, $state, users) {
    $scope.users = users;
    $scope.newUser = {};
    $scope.createUser = function() {
        $http.post('/api/users', $scope.newUser).finally(function() {
            $state.go($state.current, {}, {reload: true});
        });
    };
    $scope.deleteUser = function(user) {
        $http.delete('/api/users/' + user._id).finally(function() {
            $state.go($state.current, {}, {reload: true});
        });
    };
});
