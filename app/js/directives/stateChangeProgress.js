'use strict';

angular.module('ddsApp').config(function($provide) {
    $provide.decorator('$modal', function($delegate, $rootScope, $timeout) {
        return {
            open: function(modalOptions) {
                $rootScope.$broadcast('modalOpenStart');
                var modal = $delegate.open(modalOptions);
                modal.opened.finally(function() {
                    $rootScope.$broadcast('modalOpenEnd');
                });

                return modal;
            }
        };
    });
});

angular.module('ddsApp').directive('stateChangeProgress', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var pendingChanges = 0;
            var stateChangeStart = function() {
                pendingChanges++;
                element.addClass('change-state-progress');
            };
            scope.$on('$stateChangeStart', stateChangeStart);
            scope.$on('modalOpenStart', stateChangeStart);

            var stateChangeEnd = function() {
                pendingChanges--;
                if (0 === pendingChanges) {
                    element.removeClass('change-state-progress');
                }
            };

            scope.$on('$stateChangeSuccess', stateChangeEnd);
            scope.$on('$stateChangeError', stateChangeEnd);
            scope.$on('modalOpenEnd', stateChangeEnd);
        }
    };
});
