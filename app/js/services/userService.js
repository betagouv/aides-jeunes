'use strict';

angular.module('ddsBackend').factory('UserService', function($http, $cookieStore, $rootScope) {
    var user;

    return {
        init: function() {
            user = $cookieStore.get('user');
        },

        authenticate: function(email, password) {
            return $http.post('/api/login', {email: email, password: password}).success(function(_user) {
                user = _user;
                $cookieStore.put('user', _user);
                $rootScope.$broadcast('userLoggedIn', user);
            });
        },

        isLoggedIn: function() {
            return angular.isObject(user);
        },

        getUser: function() {
            return user;
        },

        getUserProfile: function() {
            return $http.get('/api/profile');
        },

        logout: function() {
            user = null;
            $cookieStore.remove('user');
            return $http.post('/api/logout');
        }
    };
});
