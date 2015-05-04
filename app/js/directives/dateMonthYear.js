'use strict';

angular.module('ddsApp').directive('ddsDateMonthYear', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.push(function(viewValue) {
                var result = moment(viewValue, ['MM/YY', 'MM/YYYY', 'MMMM YYYY']);

                ctrl.$setValidity('ddsDateMonthYear', result.isValid());

                return result;
            });

            ctrl.$formatters.push(function(momentInstance) {
                if (! momentInstance) return;

                return momentInstance.format('MMM YYYY');
            });
        }
    };
});
