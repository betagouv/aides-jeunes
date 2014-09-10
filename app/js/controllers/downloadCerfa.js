'use strict';

angular.module('ddsApp').controller('DownloadCerfaCtrl', function($scope, $sce, cerfaForms, CerfaService, SituationService, IndividuService, situation, droit) {
    $scope.situation = situation;
    $scope.cerfa = CerfaService.getCerfaFromDroit(droit);
    $scope.cerfaForms = CerfaService.getCerfaFormsFromDroit(droit, situation);

    var individus = SituationService.createIndividusList(situation);
    $scope.isSituationMonoIndividu = 1 === individus.length;

    // construction de la liste des pièces justificatives et des personnes concernées
    $scope.piecesJustificatives = [];
    $scope.cerfa.piecesJustificatives.forEach(function(pieceJustificative) {
        var piece = { description: pieceJustificative };
        if (false !== pieceJustificative.isIndividualized) {
            var individusConcernes = CerfaService.pieceJustificativeIndividus(droit, pieceJustificative.id, individus);
            if (!individusConcernes.length) {
                return;
            }

            piece.individus = _.map(individusConcernes, IndividuService.label);
        } else {
            if (!CerfaService.isPieceJustificativeRequiredForSituation(droit, pieceJustificative.id, situation)) {
                return;
            }
        }

        $scope.piecesJustificatives.push(piece);
    });

    $scope.trustAsHtml = function(content) {
        return $sce.trustAsHtml(content);
    };
});
