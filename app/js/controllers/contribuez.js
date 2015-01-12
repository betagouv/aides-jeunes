'use strict';

angular.module('ddsApp').controller('ContribuezCtrl', function($scope, $http, acceptanceTests, keywords, $stateParams, $state) {
    $scope.tests = acceptanceTests;
    $scope.keywords = keywords;
    $scope.selectedKeywords = ($stateParams.keyword) ? $stateParams.keyword : [];
    $scope.readOnly = true;

    $scope.validate = function() {
        $state.go('contribuez.list', { keyword: $scope.selectedKeywords }, { reload: true });
        // AcceptanceTestsService.get({
        //     keyword: $scope.selectedKeywords
        // }).then(function(result) {
        //     $scope.tests = result;
        // });
    };
});
