'use strict';

angular.module('acceptanceTests').factory('UserService', function($http, $rootScope, $sessionStorage) {
    return {
        user: function() {
            return $sessionStorage.user;
        },

        retrieveUserAsync: function() {
            return $http.get('/api/profile').then(function(result) {
                $sessionStorage.user = result.data;
            });
        },

        login: function(email, password) {
            return $http.post('/api/login', {email: email, password: password}).then(function(result) {
                $sessionStorage.user = result.data;
                $rootScope.$broadcast('userLoggedIn', $sessionStorage.user);
                return result.data;
            });
        },

        logout: function() {
            return $http.post('/api/logout').then(function(result) {
                $sessionStorage.user = null;
                $rootScope.$broadcast('userLoggedOut');
                return result;
            });
        }
    };
});
