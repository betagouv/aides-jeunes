'use strict';

angular.module('ddsBackend').factory('UserService', function($http) {
    var user;

    return {
        authenticate: function(email, password) {
            return $http.post('/api/login', {email: email, password: password}).success(function(_user) {
                user = _user;
            });
        },

        isLoggedIn: function() {
            return angular.isObject(user);
        },

        logout: function() {
            user = null;
        }
    };
});
