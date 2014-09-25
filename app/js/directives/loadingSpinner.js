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

angular.module('ddsApp').directive('loadingSpinner', function($timeout) {
    return {
        restrict: 'E',
        template: '<div class="loading-spinner" ng-show="loading"><div class="loading-spinner-icon"></div></div>',
        link: function(scope, element) {
            scope.loading = false;
            var pendingChanges = 0;
            var changingState = false;
            var stateChangeStart = function() {
                pendingChanges++;
                $timeout(function() {
                    if (0 < pendingChanges) {
                        scope.loading = true;
                    }
                }, 100);
            };
            scope.$on('$stateChangeStart', function() {
                if (!changingState) {
                    changingState = true;
                    stateChangeStart();
                }
            });
            scope.$on('modalOpenStart', stateChangeStart);

            var stateChangeEnd = function() {
                pendingChanges--;
                if (0 === pendingChanges) {
                    scope.loading = false;
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
