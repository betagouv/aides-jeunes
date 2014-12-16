'use strict';

angular.module('acceptanceTests').controller('TestTimelineCtrl', function($scope) {
    $scope.$emit('stopWaiting');
});
