'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $state, ressourceTypes, SituationService) {

    $scope.sortedIndividus = SituationService.getIndividusSortedParentsFirst($scope.situation);
    var haveEnfantsBeenDeclared;

    $scope.markEnfantsAsDeclared = function() {
        haveEnfantsBeenDeclared = true;
        var lastAdultIndex = SituationService.getConjoint($scope.situation) ? 1 : 0;
        $scope.declareNextIndividuResources(lastAdultIndex);
    };

    $scope.declareNextIndividuResources = function (lastIndividuDeclaredIndex) {
        var nextIndividuIndex = lastIndividuDeclaredIndex + 1;
        var nextIndividu = $scope.sortedIndividus[nextIndividuIndex];
        if (! nextIndividu) {
            $scope.$emit('ressources');
            return;
        }
        if (nextIndividu.role == 'conjoint' || nextIndividu.hasRessources) {
            $state.go('foyer.ressources.individu.types', { individu: nextIndividuIndex });
            return;
        }
        if (! haveEnfantsBeenDeclared) {
            $state.go('foyer.ressources.enfants');
            return;
        } else {
            $scope.declareNextIndividuResources(nextIndividuIndex);
        }
    };
});
