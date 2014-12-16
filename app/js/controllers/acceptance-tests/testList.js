'use strict';

angular.module('acceptanceTests').controller('TestListCtrl', function($scope) {
    $scope.$emit('stopWaiting');
});
