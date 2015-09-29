'use strict';

angular.module('ddsApp').controller('FoyerConjointCtrl', function($scope, $state, SituationService) {
    var hasEnfant = SituationService.hasEnfant($scope.situation);
    $scope.demandeur = SituationService.getDemandeur($scope.situation);

    $scope.captureIsolement = function() {
        return angular.isDefined($scope.vitEnCouple) && (! $scope.vitEnCouple) && hasEnfant;
    };

    $scope.submit = function() {
        $state.go('foyer.logement');
    };

    if (_.find($scope.situation.individus, { role: 'conjoint' })) {
        $scope.vitEnCouple = true;
    }
});
