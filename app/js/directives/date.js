'use strict';

var FORMATS = {
    'JJ/MM/AAAA': {
        acceptedFormats: ['DD/MM/YY', 'DD/MM/YYYY'],
        outputFormat: 'DD/MM/YYYY',
        cleaveFormat: ['d', 'm', 'Y'],
    },
    'MM/AAAA': {
        acceptedFormats: ['MM/YY', 'MM/YYYY'],
        outputFormat: 'MM/YYYY',
        cleaveFormat: ['m', 'Y'],
    }
}

angular.module('ddsApp').directive('ddsDate', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attributes, ctrl) {
            var format = attributes.format;
            // For some reason, double quotes appear when interpolating a moment in an angular expression. We strip them.
            var maxDate = attributes.max && moment(attributes.max.replace(/"/g, ''));
            var minDate = attributes.min && moment(attributes.min.replace(/"/g, ''));
            element.attr('placeholder', format);
            element.attr('maxlength', format.length);
            element.attr('type', 'text');

            ctrl.$parsers.push(function(viewValue) {
                return moment(viewValue, FORMATS[format].acceptedFormats, true);
            });

            maxDate && ctrl.$parsers.push(function(momentInstance) {
                ctrl.$setValidity('isAfterMax', maxDate.diff(momentInstance, 'days') >= 0);
                return momentInstance;
            });

            minDate && ctrl.$parsers.push(function(momentInstance) {
                ctrl.$setValidity('isBeforeMin', minDate.diff(momentInstance, 'days') <= 0);
                return momentInstance;
            });

            ctrl.$formatters.push(function(date) {
                if (! date) return;

                return moment(date).format(FORMATS[format].outputFormat);
            });

            var formatter = new Cleave(element, {
                date: true,
                datePattern: (FORMATS[format].cleaveFormat),
            });

            element.on('$destroy', formatter.destroy.bind(formatter));  // don't leak event listeners
        }
    };
});
