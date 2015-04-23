'use strict';

angular.module('ddsApp').directive('ddsDate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.push(function(viewValue) {
                var result = moment(viewValue, ['DD/MM/YY', 'L', 'LL']);

                ctrl.$setValidity('ddsDate', result.isValid());

                return result;
            });

            ctrl.$formatters.push(function(momentInstance) {
                if (! momentInstance) return;

                return momentInstance.format('DD/MM/YYYY');
            });
        }
    };
});
