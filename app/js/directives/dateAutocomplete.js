'use strict';

angular.module('ddsApp').directive('dateAutocomplete', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            new Cleave(element, {
                date: true,
                datePattern: ['d', 'm', 'Y']
            });
        }
    };
});
