'use strict';

angular.module('ddsApp').controller('FoyerConjointCtrl', function($scope, $state, SituationService) {
    var demandeur = SituationService.getDemandeur($scope.situation);
    var hasChildren = SituationService.hasEnfant($scope.situation);
    $scope.famille = $scope.situation.famille;

    var isFirstView = demandeur.statut_marital === undefined;
    $scope.locals = {
        isInCouple : isFirstView ? undefined : Boolean(SituationService.getConjoint($scope.situation)),
    };

    function isInCoupleUpdated() {
        if ($scope.locals.isInCouple) {
            delete $scope.famille.rsa_isolement_recent;
        } else {
            // Célibataire is the default value - Enum index 2 in OpenFisca
            demandeur.statut_marital = 'celibataire';
            // On supprime l'éventuel conjoint qui existait avant
            $scope.situation.individus = _.filter($scope.situation.individus, function(individu) {
                return 'conjoint' !== individu.role;
            });
            if (isFirstView && (! captureRsaIsolementRecent())) {
                $scope.submit();
            }
        }
    }
    $scope.isInCoupleUpdated = isInCoupleUpdated;

    function captureRsaIsolementRecent() {
        return $scope.locals.isInCouple == false && hasChildren;
    }
    $scope.captureRsaIsolementRecent = captureRsaIsolementRecent;

    function rsaIsolementRecentUpdated() {
        if (! shouldDisplaySubmit()) {
            $scope.submit();
        }
    }
    $scope.rsaIsolementRecentUpdated = rsaIsolementRecentUpdated;

    $scope.displayPreviousButton = true;

    $scope.previous = function() {
        $state.go('foyer.enfants');
    }

    function shouldDisplaySubmit() {
        return ($scope.locals.isInCouple == false) && (! isFirstView);
    }
    $scope.shouldDisplaySubmit = shouldDisplaySubmit;

    function submit() {
        $state.go('foyer.logement');
    }
    $scope.submit = submit;
});
