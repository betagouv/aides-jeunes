'use strict';

// As we are using Babel, make sure to require smooth-scroll *WITHOUT* polyfills
var SmoothScroll = require('smooth-scroll/dist/smooth-scroll.js');

angular.module('ddsCommon').factory('ScrollService', function() {
    var scroll = new SmoothScroll();

    function go(event, destination, offset) {
        event.preventDefault();
        scroll.animateScroll(destination, event.target, {
            updateURL: false,
            offset: function() {
                return offset || 0;
            }
        });
    }
    return {
        handler: function(destination, offset) {
            return function(event) {
                go(event, destination, offset);
            };
        },
        go: go
    };
});
