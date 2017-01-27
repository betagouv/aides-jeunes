'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription, SituationService) {
    $scope.prestationsNationales = droitsDescription.prestationsNationales;
    $scope.partenairesLocaux = droitsDescription.partenairesLocaux;

    $scope.hasLocalSituation = function() {
        return SituationService.hasLocalSituation();
    };

    $scope.countPrestations = function(provider) {
        return Object.keys(provider.prestations).length;
    };
});
