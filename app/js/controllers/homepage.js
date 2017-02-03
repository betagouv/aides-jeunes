'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription, $timeout) {
    [ 'prestationsNationales', 'partenairesLocaux' ].forEach(function(type) {
        $scope[type] = droitsDescription[type];

        $scope[type + 'Count'] = Object.keys(droitsDescription[type]).reduce(function(total, provider) {
            return total + $scope.countPrestations(droitsDescription[type][provider]);
        }, 0);
    });

    $scope.countPrestations = function(provider) {
        return Object.keys(provider.prestations).length;
    };

    $timeout(function() {
        document.querySelector('#valueProposition a').focus();
    }, 1500);
});
