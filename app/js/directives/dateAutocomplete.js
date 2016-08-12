'use strict';

angular.module('ddsApp').directive('dateAutocomplete', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var formatter = new Cleave(element, {
                date: true,
                datePattern: ('ddsDateMonthYear' in attributes ? ['m', 'Y'] : ['d', 'm', 'Y']),
            });

            element.on('$destroy', formatter.destroy.bind(formatter));  // don't leak event listeners
        }
    };
});
