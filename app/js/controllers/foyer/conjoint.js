'use strict';

angular.module('ddsApp').controller('FoyerConjointCtrl', function($scope, $state, SituationService) {
    var hasEnfant = SituationService.hasEnfant($scope.situation);
    var famille = $scope.famille = $scope.situation.famille;

    $scope.vitEnCouple = Boolean(SituationService.getConjoint($scope.situation));
    if ((! $scope.vitEnCouple) && famille.rsa_isolement_recent === undefined) {
        $scope.vitEnCouple = undefined;
    }
    $scope.shouldDisplaySubmit = function(force) {
        return ($scope.shouldDisplaySubmitInitially || force) && (! $scope.vitEnCouple) && (famille.rsa_isolement_recent !== undefined);
    };
    $scope.shouldDisplaySubmitInitially = $scope.shouldDisplaySubmit(true);

    $scope.captureIsolement = function() {
        return $scope.vitEnCouple === false && hasEnfant;
    };

    $scope.onRsaIsolementRecentUpdate = function() {
        if (! $scope.shouldDisplaySubmitInitially) {
            $scope.submit();
        }
    };

    $scope.submit = function() {
        $state.go('foyer.logement');
    };

});
