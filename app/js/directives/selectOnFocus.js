'use strict';

angular.module('ddsApp').directive('selectOnFocus', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.on('click', function() {
                this.select();
            });
        }
    };
});
