'use strict';

angular.module('ddsApp').controller('FoyerRessourcesEnfantsCtrl', function($scope, SituationService, RessourceService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract(1, 'years');
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');

    $scope.enfants = SituationService.getEnfants($scope.situation);
    $scope.enfants.forEach(function(enfant) {
        // yesNoQuestion requires a boolean
        enfant.hasRessources = ! _.isEmpty(RessourceService.extractIndividuSelectedRessourceTypes(enfant));
    });

    $scope.escape = _.escape;

    $scope.submit = function() {
        $scope.enfants.forEach(function(enfant) {
            if (! enfant.hasRessources) {
                var ressourceTypes = RessourceService.extractIndividuSelectedRessourceTypes(enfant);
                _.keys(ressourceTypes).forEach(function(ressourceType) {
                    delete enfant[ressourceType];
                });
            }
        });
        $scope.markEnfantsAsDeclared();
    };
});
