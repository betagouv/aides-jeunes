'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, droitsDescription, $timeout, ABTestingService) {
    [ 'prestationsNationales', 'partenairesLocaux' ].forEach(function(type) {
        $scope[type] = droitsDescription[type];

        $scope[type + 'Count'] = Object.keys(droitsDescription[type]).reduce(function(total, provider) {
            return total + Object.keys(droitsDescription[type][provider].prestations).length;
        }, 0);
    });

    $timeout(function() {
        document.querySelector('#valueProposition a').focus();
    }, 1500);

    ABTestingService.setABTestingEnvironment();
});
