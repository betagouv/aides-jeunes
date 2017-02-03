'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription) {
    [ 'prestationsNationales', 'partenairesLocaux' ].forEach(function(type) {
        $scope[type] = droitsDescription[type];

        $scope[type + 'Count'] = Object.keys(droitsDescription[type]).reduce(function(total, provider) {
            return total + Object.keys(droitsDescription[type][provider].prestations).length;
        }, 0);
    });
});
