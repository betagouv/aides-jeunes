'use strict';

angular.module('ddsApp').directive('navigationBar', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/navigation-bar.html',
        transclude: {
            message: '?message', // This slot is optional
        }
    };
});
