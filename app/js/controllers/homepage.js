'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription) {
    $scope.prestationsNationales = droitsDescription.prestationsNationales;
    $scope.partenairesLocaux = droitsDescription.partenairesLocaux;

    $scope.countPrestations = function(provider) {
        return Object.keys(provider.prestations).length;
    };
});
