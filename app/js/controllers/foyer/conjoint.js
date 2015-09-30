'use strict';

angular.module('ddsApp').controller('FoyerConjointCtrl', function($scope, $state, SituationService) {
    var hasEnfant = SituationService.hasEnfant($scope.situation);
    $scope.demandeur = SituationService.getDemandeur($scope.situation);

    // Forget the value of isolementRecent. Necessary as we une ng-change to go to the next page.
    $scope.demandeur.isolementRecent = undefined;

    $scope.captureIsolement = function() {
        return $scope.vitEnCouple === false && hasEnfant;
    };

    $scope.submit = function() {
        $state.go('foyer.logement');
    };

    if (_.find($scope.situation.individus, { role: 'conjoint' })) {
        $scope.vitEnCouple = true;
    }
});
