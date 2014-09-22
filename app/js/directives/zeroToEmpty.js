'use strict';

angular.module('ddsApp').directive('zeroToEmpty', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            element.on('focus', function() {
                if ('0' === ngModel.$viewValue) {
                    ngModel.$setViewValue(null);
                    ngModel.$render();
                }
            });
            element.on('blur', function() {
                if (null === ngModel.$viewValue) {
                    ngModel.$setViewValue('0');
                    ngModel.$render();
                }
            });
        }
    };
});
