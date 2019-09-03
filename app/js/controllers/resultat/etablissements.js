'use strict';

angular.module('ddsApp').controller('EtablissementsCtrl', function($scope, SituationService, ResultatService, EtablissementService) {

    $scope.isLoaded = false;
    $scope.$on('resultat:loading:changed', function(event, loading) {
        $scope.isLoaded = ! loading;
    });

    var situation = $scope.situation = SituationService.restoreLocal();
    if (situation._id) {
        $scope.defaultEtablissementTypes =
            EtablissementService.getEtablissementTypesBySituation($scope.situation);
    }
});
