'use strict';

angular.module('ddsBackend').service('UserService', function($http) {
    var user;

    return {
        login: function(username, password) {
            $http.post('/api/login', {username: username, password: password}).success(function(_user) {
                user = _user;
            });
        },

        isLoggedIn: function() {
            return false;
        }
    };
});
