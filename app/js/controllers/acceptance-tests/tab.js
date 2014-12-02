'use strict';

angular.module('acceptanceTests').controller('TabCtrl', function($scope, $http, $q, $window, $state, $stateParams, $location, $timeout, $modal, droitsDescription, acceptanceTests, AcceptanceTestsService) {
    $scope.$emit('stopWaiting');

    $scope.tests = acceptanceTests;
    $scope.categories = AcceptanceTestsService.categorizeTests(acceptanceTests);
    $scope.pendingTests = 0;

    var beforeLaunch = function() {
        $scope.pendingTests++;
    };

    var afterLaunch = function() {
        $scope.pendingTests--;
    };

    var onError = function() {
        $scope.errors++;
    };

    $scope.showErrors = function() {
        return angular.isDefined($scope.errors);
    };

    $scope.launchAllTests = function() {
        $scope.errors = 0;
        AcceptanceTestsService.launchAllTests($scope.categories, beforeLaunch, afterLaunch, onError);
    };
});
