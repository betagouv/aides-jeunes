'use strict';

var scrollMonitor = require('scrollmonitor');
var ResizeSensor = require('css-element-queries').ResizeSensor;
var elementWatcher;

angular.module('ddsApp').directive('nextButton', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/next-button.html',
        transclude: {
            message: '?message', // This slot is optional
        },
        link(scope, element, attrs) {

            var $offsetMarker = document.getElementById('offset-marker');
            var $nextButton = document.getElementById('next-button');

            var $content = document.querySelector('.content');
            new ResizeSensor($content, function() {
                if (elementWatcher) {
                    elementWatcher.recalculateLocation();
                    elementWatcher.update();
                    elementWatcher.triggerCallbacks();
                }
            });

            angular.element(function() {

                if (elementWatcher) {
                    elementWatcher.destroy();
                }

                elementWatcher = scrollMonitor.create($offsetMarker);
                elementWatcher.stateChange(function() {
                    if (this.isBelowViewport) {
                        $nextButton.classList.add('next-button--sticky');
                    } else {
                        $nextButton.classList.remove('next-button--sticky');
                    }
                });

                if (elementWatcher.isBelowViewport) {
                    $nextButton.classList.add('next-button--sticky');
                }
            });

        }
    };
});
