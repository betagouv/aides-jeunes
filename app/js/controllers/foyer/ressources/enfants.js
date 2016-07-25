'use strict';

angular.module('ddsApp').controller('FoyerRessourcesEnfantsCtrl', function($scope, SituationService, RessourceService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.enfants = SituationService.getEnfants($scope.situation);
    $scope.enfants.forEach(function(enfant) {
    	enfant.hasRessources = RessourceService.getMainScreenRessources(enfant).length > 0;
    });

    $scope.submit = function() {
        $scope.enfants.forEach(function(enfant) {
            if (! enfant.hasRessources) {
                RessourceService.applyRessourcesToIndividu(enfant, [], $scope.situation.dateDeValeur);
            }
        });
        $scope.markEnfantsAsDeclared();
    };
});
