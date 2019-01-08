'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $state, ressourceTypes, SituationService) {

    var sortedIndividus = SituationService.getIndividusSortedParentsFirst($scope.situation);
    var haveEnfantsResourcesBeenDeclared;

    $scope.markEnfantsAsDeclared = function() {
        haveEnfantsResourcesBeenDeclared = true;
        var lastAdultIndex = SituationService.getConjoint($scope.situation) ? 1 : 0;
        $scope.declareNextIndividuResources(lastAdultIndex);
    };

    $scope.declareNextIndividuResources = function (lastIndividuDeclaredIndex) {
        $scope.$parent.$broadcast('ressourcesUpdated');
        var nextIndividuIndex = lastIndividuDeclaredIndex + 1;
        var nextIndividu = sortedIndividus[nextIndividuIndex];
        if (! nextIndividu) {
            $state.go('foyer.pensionsAlimentaires');
            return;
        }
        if (nextIndividu.role == 'conjoint' || nextIndividu.hasRessources) {
            $state.go('foyer.ressources.individu.types', { individu: nextIndividuIndex });
            return;
        }
        if (! haveEnfantsResourcesBeenDeclared) {
            $state.go('foyer.ressources.enfants');
            return;
        } else {
            $scope.declareNextIndividuResources(nextIndividuIndex);
        }
    };
});
