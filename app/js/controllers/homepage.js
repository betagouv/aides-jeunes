'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription) {
    $scope.prestationsNationales = droitsDescription.prestationsNationales;
    $scope.partenairesLocaux = droitsDescription.partenairesLocaux;
});
