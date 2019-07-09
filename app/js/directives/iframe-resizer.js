'use strict';

var iFrameResize = require('iframe-resizer');
angular.module('ddsApp').directive('ngIframeResizer', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            iFrameResize.iframeResizer({}, element[0]);

            element.on('$destroy', function () {
                element[0].iFrameResizer.close();
            });
        }
    };
});
