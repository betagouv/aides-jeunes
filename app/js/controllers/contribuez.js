'use strict';

angular.module('ddsApp').controller('ContribuezCtrl', function($scope, $http, acceptanceTests, AcceptanceTestsService) {
    $scope.tests = acceptanceTests;
    $scope.categories = AcceptanceTestsService.categorizeTests(acceptanceTests);
});
