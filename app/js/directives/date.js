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
            var maxDate = moment(attributes.max, 'DD/MM/YYYY');
            element.attr('placeholder', format);
            element.attr('maxlength', format.length);
            element.attr('type', 'text');

            ctrl.$parsers.push(function(viewValue) {
                return moment(viewValue, FORMATS[format].acceptedFormats, true);
            });

            ctrl.$parsers.push(function(momentInstance) {
                ctrl.$setValidity('dateIsLaterThanMax', maxDate.diff(momentInstance, 'days') >= 0);
                return momentInstance;
            });

            ctrl.$formatters.push(function(momentInstance) {
                if (! momentInstance) return;

                return momentInstance.format(FORMATS[format].outputFormat);
            });

            var formatter = new Cleave(element, {
                date: true,
                datePattern: (FORMATS[format].cleaveFormat),
            });

            element.on('$destroy', formatter.destroy.bind(formatter));  // don't leak event listeners
        }
    };
});
