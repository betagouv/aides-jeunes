'use strict';

angular.module('ddsApp').directive('ddsDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                var date = moment(viewValue, 'DD/MM/YYYY', true);
                if (date.isValid()) {
                    ctrl.$setValidity('ddsDate', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('ddsDate', false);
                    return undefined;
                }
            });
        }
    };
});
