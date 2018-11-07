'use strict';

angular.module('ddsApp').directive('droitsList', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/droits-list.html',
        scope: {
            droits: '='
        }
    };
});
