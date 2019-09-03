'use strict';

angular.module('ddsApp').directive('nextButton', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/simulation/next-button.html',
        transclude: {
            message: '?message', // This slot is optional
        },
    };
});
