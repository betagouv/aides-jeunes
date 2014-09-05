'use strict';

angular.module('ddsApp').controller('DownloadCerfaCtrl', function($scope, $sce, cerfaForms, CerfaService, situation, droit) {
    $scope.situation = situation;
    $scope.cerfa = _.find(cerfaForms, {droitId: droit});
    $scope.cerfaForms = CerfaService.getCerfaFormsFromDroit(droit, situation);

    $scope.trustAsHtml = function(content) {
        return $sce.trustAsHtml(content);
    };
});
