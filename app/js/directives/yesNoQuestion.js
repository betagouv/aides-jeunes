'use strict';

angular.module('ddsApp').directive('yesNoQuestion', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/foyer/yes-no-question.html',
        scope: true,
        controller: 'yesNoQuestionCtrl',
        link: function ($scope, $element, $attributes) {
            $scope.modelString = $attributes.model;
        }
    };
});

angular.module('ddsApp').controller('yesNoQuestionCtrl', function($scope, $transclude, $element) {
    $element.find('legend').append($transclude())

	// To get the object and the property described by the `model` directive attribute.
    function parse(modelString) {
        var re = /(.*)[.](.*)/;
        var resultRegexp = re.exec(modelString);
        return {
            objectToModify: $scope.$eval(resultRegexp[1]),
            propertyToModify: resultRegexp[2]
        };
    }

    // ng-model doesn't accept a dynamic parameter, so we have to transmit the value manually.
    $scope.updateModel = function() {
    	var parsedModelString = parse($scope.modelString);
        parsedModelString.objectToModify[parsedModelString.propertyToModify] = $scope.value;
    };
});
