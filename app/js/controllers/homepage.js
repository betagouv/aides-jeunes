'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, $state, $sessionStorage, droitsDescription, $timeout, ABTestingService, phishingExpressions) {
    [ 'prestationsNationales', 'partenairesLocaux' ].forEach(function(type) {
        $scope[type] = droitsDescription[type];

        $scope[type + 'Count'] = Object.keys(droitsDescription[type]).reduce(function(total, provider) {
            return total + Object.keys(droitsDescription[type][provider].prestations).length;
        }, 0);
    });

    ABTestingService.setABTestingEnvironment();

    var referrer = document.referrer;
    if (referrer.match(/ameli\.fr/)) {
        if (! $sessionStorage.ameliNoticationDone) {
            $sessionStorage.ameliNoticationDone = true;
            $state.go('ameli');
        }
    } else if (_.some(phishingExpressions, function(phishingExpression) { return referrer.match(phishingExpression); })) {
        if (! $sessionStorage.phishingNoticationDone) {
            $sessionStorage.phishingNoticationDone = true;
            $state.go('hameconnage');
        }
    } else {
        $timeout(function() {
            document.querySelector('#valueProposition a').focus();
        }, 1500);
    }
});
