'use strict';

angular.module('ddsApp').controller('DownloadCerfaCtrl', function($scope, $sce, $window, cerfaForms, CerfaService, situation, droit, droitsDescription) {
    $scope.droitLabel = droitsDescription.prestationsNationales[droit].label;
    $scope.situation = situation;
    $scope.cerfa = cerfaForms[droit];
    $scope.cerfaForms = CerfaService.getCerfaFormsFromDroit(droit, situation);

    $scope.isSituationMonoIndividu = 1 === situation.individus.length;

    // construction de la liste des pièces justificatives et des personnes concernées
    $scope.piecesJustificatives = CerfaService.getRequiredPiecesJustificatives($scope.cerfa, droit, situation);

    $scope.trustAsHtml = function(content) {
        return $sce.trustAsHtml(content);
    };

    $scope.openCerfaLink = function(url) {
        $window.open(url, '_blank');
    };
});
