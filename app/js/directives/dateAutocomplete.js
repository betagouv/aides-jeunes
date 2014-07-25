'use strict';

angular.module('ddsApp').directive('dateAutocomplete', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            var lastViewValue = '';
            ngModel.$parsers.unshift(function(viewValue) {
                var previousValue = lastViewValue;
                lastViewValue = viewValue;

                var index = viewValue.lastIndexOf('//');
                if (-1 !== index && index === viewValue.length - 2) {
                    var newValue = viewValue.substring(0, viewValue.length - 1);
                    ngModel.$setViewValue(newValue);
                    ngModel.$render();

                    return newValue;
                }

                if (!_.contains([2, 5], viewValue.length)) return viewValue;
                if (viewValue.length !== previousValue.length + 1) return viewValue;
                if (previousValue.lastIndexOf('/') === previousValue.length - 1) return viewValue;
                if (viewValue.lastIndexOf('/') === viewValue.length - 1) return viewValue;

                ngModel.$setViewValue(viewValue + '/');
                ngModel.$render();

                return viewValue + '/';
            });
        }
    };
});
