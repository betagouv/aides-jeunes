'use strict';

angular.module('ddsApp').controller('DownloadCerfaCtrl', function($scope, $sce, cerfaForms, CerfaService, situation, droit) {
    $scope.situation = situation;
    $scope.cerfa = CerfaService.getCerfaFromDroit(droit);
    $scope.cerfaForms = CerfaService.getCerfaFormsFromDroit(droit, situation);

    $scope.isSituationMonoIndividu = 1 === situation.individus.length;

    // construction de la liste des pièces justificatives et des personnes concernées
    $scope.piecesJustificatives = CerfaService.getRequiredPiecesJustificatives($scope.cerfa, droit, situation);

    $scope.trustAsHtml = function(content) {
        return $sce.trustAsHtml(content);
    };
});
