'use strict';

angular.module('acceptanceTests').controller('UsersCtrl', function($scope, $http, $state, users, organizations) {
    $scope.users = users;
    $scope.organizations = organizations;
    $scope.newUser = {};
    $scope.currentUser = {};
    $scope.createUser = function() {
        $http.post('/api/users', $scope.newUser).finally(function() {
            $state.go($state.current, {}, {reload: true});
        });
    };
    $scope.updateUser = function() {
        $http.put('/api/users/' + $scope.currentUser._id, $scope.currentUser).finally(function() {
            $state.go($state.current, {}, {reload: true});
            $scope.currentUser = {};
        });
    };
    $scope.editUser = function(user) {
        $scope.currentUser = _.clone(user);
    };
    $scope.deleteUser = function(user) {
        $http.delete('/api/users/' + user._id).finally(function() {
            $state.go($state.current, {}, {reload: true});
        });
    };
});
