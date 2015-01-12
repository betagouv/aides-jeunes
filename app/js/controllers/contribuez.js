'use strict';

angular.module('ddsApp').controller('ContribuezCtrl', function($scope, $http, keywords, $stateParams, $state) {
    $scope.keywords = keywords;
    if ($stateParams.keyword) {
        if (_.isArray($stateParams.keyword)) {
            $scope.selectedKeywords = $stateParams.keyword;
        } else {
            $scope.selectedKeywords = [$stateParams.keyword];
        }
    } else {
        $scope.selectedKeywords = [];
    }
    $scope.readOnly = true;

    $scope.validate = function() {
        $state.go('contribuez.list', { keyword: $scope.selectedKeywords }, { reload: true });
    };
});
