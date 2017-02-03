'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription) {
    $scope.countPrestations = function(provider) {
        return Object.keys(provider.prestations).length;
    };

    [ 'prestationsNationales', 'partenairesLocaux' ].forEach(function(type) {
        $scope[type] = droitsDescription[type];

        $scope[type + 'Count'] = Object.keys(droitsDescription[type]).reduce(function(total, provider) {
            return total + $scope.countPrestations(droitsDescription[type][provider]);
        }, 0);
    });
});
