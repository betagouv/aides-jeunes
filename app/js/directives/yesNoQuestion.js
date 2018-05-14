'use strict';

angular.module('ddsApp').directive('yesNoQuestion', function($parse) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/foyer/yes-no-question.html',
        scope: true,
        controller: 'yesNoQuestionCtrl',
        link: function ($scope, $element, $attributes) {

            var getter = $parse($attributes.model);
            var setter = getter.assign;

            // We need a unique name for the radio input, in case this directive is used in a ng-repeat.
            $scope.uniqueFieldName = 'field.' + Math.random().toString(36).slice(2);
            $scope.value = String(getter($scope));

            $scope.gridSize = {
                question: $attributes.size || 3,
                helpText: 9 - ($attributes.size || 3)
            };

            // ng-model doesn't accept a dynamic parameter, so we have to transmit the value manually.
            $scope.updateValue = function() {
                setter($scope, ($scope.value == 'true'));
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
