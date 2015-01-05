'use strict';

angular.module('acceptanceTests').controller('TestListCtrl', function($scope, AcceptanceTestsService) {
    $scope.$emit('stopWaiting');

    $scope.launchSingleTest = function(test) {
        AcceptanceTestsService.launchSingleTest(test);
    };
});
