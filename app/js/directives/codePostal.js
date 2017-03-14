angular.module('ddsApp').directive('codePostal', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attributes, ctrl) {
            element.attr('type', 'text');
            element.attr('inputmode', 'numeric');
            element.attr('minlength', '5');
            element.attr('maxlength', '5');
            element.attr('pattern', '[0-9]{5}');
            element.attr('ng', 'pattern="/[0-9]{5}/');
            element.attr('title', 'Cinq chiffres');

            ctrl.$validators.format = function(modelValue) {
                if (! modelValue)
                    return true;

                return modelValue.length == 5 && ! isNaN(Number(modelValue));
            };

            ctrl.$validators.isMayotte = function(modelValue) {
                if (! modelValue)
                    return true;

                return modelValue.indexOf('976') != 0;
            };
        }
    };
});
