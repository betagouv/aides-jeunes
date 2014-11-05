'use strict';

angular.module('ddsApp').controller('FoyerDemandeurCtrl', function($scope, $rootScope, SituationService) {
    $scope.relationTypeLabels = SituationService.relationTypeLabels;

    $rootScope.$on('individu.demandeur', function(e, demandeur) {
        $scope.situation.demandeur = demandeur;
        demandeur.role = 'demandeur';
    });
});
