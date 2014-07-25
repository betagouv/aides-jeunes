'use strict';

angular.module('ddsApp').directive('stateChangeProgress', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var pendingChanges = 0;
            scope.$on('$stateChangeStart', function() {
                pendingChanges++;
                element.addClass('change-state-progress');
            });

            var stateChangeEnd = function() {
                pendingChanges--;
                if (0 === pendingChanges) {
                    element.removeClass('change-state-progress');
                }
            };

            scope.$on('$stateChangeSuccess', stateChangeEnd);
            scope.$on('$stateChangeError', stateChangeEnd);
        }
    };
});
