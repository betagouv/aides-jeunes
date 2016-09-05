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
            element.attr('placeholder', format);
            element.attr('maxlength', format.length);
            element.attr('type', 'text');

            ctrl.$parsers.push(function(viewValue) {
                var result = moment(viewValue, FORMATS[format].acceptedFormats, true);
                ctrl.$setValidity('format', result.isValid());

                return result;
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
