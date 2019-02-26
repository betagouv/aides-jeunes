'use strict';

var textMask = require('vanilla-text-mask');
var createAutoCorrectedDatePipe = require('text-mask-addons').createAutoCorrectedDatePipe;

var FORMATS = {
    'JJ/MM/AAAA': {
        format: 'DD/MM/YYYY',
        mask: [
            /\d/, /\d/,
            '/',
            /\d/, /\d/,
            '/',
            /\d/, /\d/, /\d/, /\d/
        ],
        autoCorrectedDatePipe: createAutoCorrectedDatePipe('dd/mm/yyyy'),
    },
    'MM/AAAA': {
        format: 'MM/YYYY',
        mask: [
            /\d/, /\d/,
            '/',
            /\d/, /\d/, /\d/, /\d/
        ],
        autoCorrectedDatePipe: createAutoCorrectedDatePipe('mm/yyyy'),
    }
};

angular.module('ddsApp').directive('ddsDate', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attributes, ctrl) {
            var format = attributes.format;
            var maxDate = attributes.max && moment(attributes.max);
            var minDate = attributes.min && moment(attributes.min);
            element.attr('placeholder', format);
            element.attr('type', 'text');

            ctrl.$parsers.push(function(viewValue) {
                return viewValue && moment(viewValue, FORMATS[format].format, true);
            });

            ctrl.$formatters.push(function(date) {
                return date && moment(date).format(FORMATS[format].format);
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

            var maskedInputController = textMask.maskInput({
                inputElement: element[0],
                mask: FORMATS[format].mask,
                pipe: FORMATS[format].autoCorrectedDatePipe,
                guide: true,
                keepCharPositions: true,
                placeholderChar: '\u2000',
            });

            element.on('$destroy', maskedInputController.destroy); // don't leak event listeners
        }
    };
});
