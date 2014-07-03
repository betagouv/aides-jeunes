'use strict';

angular.module('ddsApp').controller('FoyerDemandeurCtrl', function($scope, $rootScope, $location, $modal, $state, $timeout, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.relationTypeLabels = SituationService.relationTypeLabels;
    $scope.nationaliteLabels = SituationService.nationaliteLabels;

    if (!$scope.situation.demandeur) {
        $timeout(function() {
            $state.go('foyer.demandeur_modal');
        });
    }

    $rootScope.$on('individu.demandeur', function(e, demandeur) {
        $scope.situation.demandeur = demandeur;
    });
});
