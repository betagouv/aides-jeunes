'use strict';

angular.module('acceptanceTests').controller('TestStatsCtrl', function($scope) {
    $scope.$emit('stopWaiting');
});
