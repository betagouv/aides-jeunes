'use strict';

angular.module('ddsApp').controller('FoyerRessourcesEnfantsCtrl', function($scope, SituationService) {
    $scope.enfants = SituationService.getEnfants($scope.situation);
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
});
