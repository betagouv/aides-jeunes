'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $state, $modal, nationalites, logementTypes, locationTypes, SituationService, IndividuService) {
    var situation = $scope.situation = SituationService.restoreLocal();
    $scope.statutsSpecifiques = IndividuService.formatStatutsSpecifiques;
    $scope.nationalite = IndividuService.nationaliteLabel;

    var buildRecapLogement = function() {
        $scope.recapLogement = _.find(logementTypes, {id: situation.logement.type}).label;
        if ('locataire' === situation.logement.type) {
            $scope.recapLogement += ' d’un logement ';
            $scope.recapLogement += _.find(locationTypes, { id: situation.logement.locationType }).label;
            $scope.loyerLabel = 'Loyer';
        } else {
            $scope.loyerLabel = 'Mensualité d’emprunt';
        }
    };

    if (situation.logement) {
        buildRecapLogement();
    }

    $scope.$on('individu.demandeur', function(e, demandeur) {
        var individu
        situation.individus.push(demandeur);
        $state.go('foyer.conjoint');
    });

    $scope.$on('individu.conjoint', function(e, conjoint) {
        if (conjoint) {
            situation.individus.push(conjoint);
        }
        $state.go('foyer.enfants');
    });

    $scope.$on('enfants', function(e, enfants) {
        situation.individus.push.apply(situation.individus, enfants);
        $state.go('foyer.personnesACharge');
    });

    $scope.$on('personnesACharge', function(e, personnesACharge) {
        situation.individus.push.apply(situation.individus, personnesACharge);
        $state.go('foyer.logement');
    });

    $scope.$on('logement', function(e, logement) {
        situation.logement = logement;
        buildRecapLogement();
        $state.go('foyer.ressources');
    });

    $scope.$on('ressources', function(e) {
        $scope.ressourcesCaptured = true;
        $state.go('foyer.patrimoine');
    });

    $scope.$on('patrimoine', function(e, patrimoine) {
        situation.patrimoine = patrimoine;
        SituationService.create(situation).then(function(result) {
            $state.go('simulation', {'situationId': result._id });
        })
    });
});
