'use strict';

angular.module('ddsApp').directive('ddsDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (angular.isString(viewValue) && viewValue.length > 0) {
                    var date = moment(viewValue, 'DD/MM/YYYY', true);
                    if (!date.isValid()) {
                        ctrl.$setValidity('ddsDate', false);

                        return undefined;
                    }
                }

                ctrl.$setValidity('ddsDate', true);

                return viewValue;
            });
        }
    };
});
