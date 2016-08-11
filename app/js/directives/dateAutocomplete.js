'use strict';

angular.module('ddsApp').directive('dateAutocomplete', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            new Cleave(element, {
                date: true,
                datePattern: ('ddsDateMonthYear' in attributes ? ['m', 'Y'] : ['d', 'm', 'Y']),
            });
        }
    };
});
