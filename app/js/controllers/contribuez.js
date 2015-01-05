'use strict';

angular.module('ddsApp').controller('ContribuezCtrl', function($scope, $http, acceptanceTests, keywords, AcceptanceTestsService) {
    $scope.tests = acceptanceTests;
    $scope.keywords = keywords;
    $scope.selectedKeywords = [];
    $scope.readOnly = true;


    $scope.validate = function() {
        AcceptanceTestsService.get({
            keyword: $scope.selectedKeywords
        }).then(function(result) {
            $scope.tests = result;
        });
    };
});
