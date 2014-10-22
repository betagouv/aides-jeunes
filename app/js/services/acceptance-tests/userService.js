'use strict';

angular.module('acceptanceTests').factory('UserService', function($http, $rootScope) {
    var user;

    return {
        user: function() {
            return user;
        },

        retrieveUserAsync: function() {
            return $http.get('/api/profile').then(function(result) {
                user = result.data;
                $rootScope.$broadcast('userLoggedIn', user);
                return result.data;
            });
        },

        login: function(email, password) {
            return $http.post('/api/login', {email: email, password: password}).then(function(result) {
                user = result.data;
                $rootScope.$broadcast('userLoggedIn', user);
                return result.data;
            });
        },

        logout: function() {
            return $http.post('/api/logout').then(function(result) {
                user = null;
                $rootScope.$broadcast('userLoggedOut');
                return result;
            });
        }
    };
});
