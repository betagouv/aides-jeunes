'use strict';

angular.module('ddsApp').controller('FoyerRessourcesEnfantsCtrl', function($scope, SituationService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.enfants = SituationService.getEnfants($scope.situation);
    $scope.enfants.forEach(function(enfant) {
    	enfant.hasRessources = enfant.ressources && (enfant.ressources.length > 0) || false;
    });

    $scope.submit = function() {
        $scope.markEnfantsAsDeclared();
    }
});
