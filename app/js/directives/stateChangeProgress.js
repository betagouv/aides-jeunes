'use strict';

angular.module('ddsApp').config(function($provide) {
    $provide.decorator('$modal', ['$delegate', '$rootScope', function($delegate, $rootScope) {
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
    }]);
});

angular.module('ddsApp').directive('stateChangeProgress', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var pendingChanges = 0;
            var changingState = false;
            var stateChangeStart = function(e, f, g) {
                pendingChanges++;
                element.addClass('change-state-progress');
            };
            scope.$on('$stateChangeStart', function() {
                if (!changingState) {
                    changingState = true;
                    stateChangeStart();
                }
            });
            scope.$on('modalOpenStart', stateChangeStart);

            var stateChangeEnd = function(e, f, g) {
                pendingChanges--;
                if (0 === pendingChanges) {
                    element.removeClass('change-state-progress');
                }
            };

            scope.$on('$stateChangeSuccess', function() {
                changingState = false;
                stateChangeEnd();
            });
            scope.$on('$stateChangeError', function() {
                changingState = false;
                stateChangeEnd();
            });
            scope.$on('modalOpenEnd', stateChangeEnd);
        }
    };
});
