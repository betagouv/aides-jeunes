'use strict';

angular.module('ddsApp').controller('DownloadCerfaCtrl', function($scope, situation, cerfa) {
    $scope.situation = situation;
    $scope.cerfa = cerfa;
});
