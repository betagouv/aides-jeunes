'use strict';

angular.module('ddsApp').directive('dateAutocomplete', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var formatter = new Cleave(element, {
                date: true,
                datePattern: ['d', 'm', 'Y']
            });

            element.on('$destroy', formatter.destroy.bind(formatter));  // don't leak event listeners
        }
    };
});
