'use strict';

angular.module('ddsApp').directive('loadingSpinner', function($timeout) {
    return {
        restrict: 'E',
        template: '<div class="loading-spinner" ng-show="loading"><div class="loading-spinner-icon"></div></div>',
        link: function(scope) {
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
                if (! changingState) {
                    changingState = true;
                    stateChangeStart();
                }
            });

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
        }
    };
});
