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
};

angular.module('ddsApp').directive('ddsDate', function($analytics) {
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

            var previousLength = 0;
            ctrl.$parsers.push(function(viewValue) {
                var value = viewValue && moment(viewValue, FORMATS[format].acceptedFormats, true);

                if (value && value.isValid() && viewValue.length != previousLength) {
                    previousLength = viewValue.length;
                    $analytics.eventTrack(previousLength, { label: 'dateLength', category: 'log' });
                }

                return value;
            });

            ctrl.$formatters.push(function(date) {
                return date && moment(date).format(FORMATS[format].outputFormat);
            });

            ctrl.$validators.format = function(modelValue) {
                return ! modelValue || modelValue.isValid();
            };
            ctrl.$validators.isAfterMax = function(modelValue) {
                return ! maxDate || ! modelValue || ! modelValue.isValid() || maxDate.diff(modelValue, 'days') >= 0;
            };
            ctrl.$validators.isBeforeMin = function(modelValue) {
                return ! minDate || ! modelValue || ! modelValue.isValid() || minDate.diff(modelValue, 'days') <= 0;
            };

            var formatter = new Cleave(element, {
                date: true,
                datePattern: (FORMATS[format].cleaveFormat),
            });

            element.on('$destroy', formatter.destroy.bind(formatter));  // don't leak event listeners
        }
    };
});
