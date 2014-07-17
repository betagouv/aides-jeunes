'use strict';

angular.module('ddsApp').controller('ResultatCtrl', function($scope, SituationService) {
    $scope.awaitingResults = true;
    SituationService.simulate().then(function(result) {
        console.log(result);
    }, function() {
        $scope.error = true;
    }).finally(function() {
        $scope.awaitingResults = false;
    });
});
