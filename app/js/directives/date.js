'use strict';

angular.module('ddsApp').directive('ddsDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                debugger;
                if (angular.isString(viewValue) && viewValue.length > 0) {
                    var date = moment(viewValue, 'DD/MM/YYYY', true);
                    if (!date.isValid()) {
                        ctrl.$setValidity('ddsDate', false);

                        return viewValue;
                    }
                }

                ctrl.$setValidity('ddsDate', true);

                return undefined;
            });
        }
    };
});
