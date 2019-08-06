'use strict';
var SmoothScroll = require('smooth-scroll');

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
