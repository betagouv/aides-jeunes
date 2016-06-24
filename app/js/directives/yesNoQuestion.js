'use strict';

angular.module('ddsApp').directive('yesNoQuestion', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/foyer/yes-no-question.html',
        scope: true,
        controller: 'yesNoQuestionCtrl',
        link: function ($scope, $element, $attributes) {

            // To get the object and the property described by the `model` directive attribute.
            function parse (propertyPath) {
                var parts = propertyPath.split('.');
                return {
                    targetProperty: parts.pop(),
                    targetObject: parts.join('.')
                };
            }

            var propertyPath = $attributes.model,
                parsedPropertyPath = parse(propertyPath),
                targetProperty = parsedPropertyPath.targetProperty,
                targetObject = $scope.$eval(parsedPropertyPath.targetObject);

            $scope.uniqueFieldId = 'field.' + Math.random().toString(36).slice(2);
            $scope.value = targetObject[targetProperty];

            // ng-model doesn't accept a dynamic parameter, so we have to transmit the value manually.
            $scope.updateValue = function() {
                targetObject[targetProperty] = $scope.value;
            };
        }
    };
});

angular.module('ddsApp').controller('yesNoQuestionCtrl', function($scope, $transclude, $element, $interpolate) {
    _.forEach($transclude(), function(elem) {
        if (elem.localName == 'question') {
            $element.find('legend').append($interpolate(elem.innerHTML)($scope));
        } else if (elem.localName == 'help-block') {
            $element.find('p').append($interpolate(elem.innerHTML)($scope));
        }
    });
});
