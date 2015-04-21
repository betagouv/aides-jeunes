'use strict';

angular.module('ddsApp').directive('ddsDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.push(function(viewValue) {
                var result = moment(viewValue, 'DD/MM/YYYY', true);

                if (result.isValid()) {
                    ctrl.$setValidity('ddsDate', true);
                    return result;
                }

                result = moment(viewValue, 'DD/MM/YY');

                if (result.isValid()) {
                    ctrl.$setValidity('ddsDate', true);
                    return result;
                }

                ctrl.$setValidity('ddsDate', false);
            });
        }
    };
});
