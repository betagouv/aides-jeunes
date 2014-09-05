'use strict';

angular.module('ddsApp').controller('DownloadCerfaCtrl', function($scope, CerfaService, situation, droit) {
    $scope.situation = situation;
    $scope.cerfaForms = CerfaService.getCerfaFormsFromDroit(droit, situation);
});
