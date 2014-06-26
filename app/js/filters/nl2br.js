'use strict';

angular.module('ddsBackend').filter('nl2br', function() {
    return function(text) {
        text = text
                .replace(/&/g, '&amp;')
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;');

        return text.replace(/\n/g, '<br>');
    }
});
