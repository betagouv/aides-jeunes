'use strict';

angular.module('ddsApp').directive('yesNoQuestion', function($parse) {
    return {
        restrict: 'E',
        // Use transclusion slots
        // @see https://docs.angularjs.org/api/ng/directive/ngTransclude
        transclude: {
            question: 'question',
            helpBlock: '?helpBlock' // This slot is optional
        },
        templateUrl: '/partials/simulation/yes-no-question.html',
        scope: true,
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
