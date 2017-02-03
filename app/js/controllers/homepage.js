'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription, $timeout) {
    $scope.prestationsNationales = droitsDescription.prestationsNationales;
    $scope.partenairesLocaux = droitsDescription.partenairesLocaux;

    $scope.countPrestations = function(provider) {
        return Object.keys(provider.prestations).length;
    };

    $timeout(function() {
        document.querySelector('#valueProposition a').focus();
    }, 1500);
});
