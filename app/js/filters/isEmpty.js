'use strict';

angular.module('ddsCommon')
    .filter('isEmpty', function() {
        return function(object) {
            return _.isEmpty(object);
        };
    })
    .filter('isNotEmpty', function() {
        return function(object) {
            return ! _.isEmpty(object);
        };
    });
