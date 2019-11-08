'use strict';

angular.module('ddsApp').controller('HomepageCtrl', function($scope, $state, $sessionStorage, droitsDescription, $timeout, ABTestingService, phishingExpressions) {
    [ 'prestationsNationales', 'partenairesLocaux' ].forEach(function(type) {
        var providersWithoutPrivatePrestations = _.mapValues(droitsDescription[type], function(provider) {
            provider = _.assign({}, provider);
            provider.prestations = _.reduce(provider.prestations, function(prestations, prestation, name) {
                if (! prestation.private) {
                    prestations[name] = prestation;
                }

                return prestations;
            }, {});
            return provider;
        });

        $scope[type] = _.filter(providersWithoutPrivatePrestations, function(provider) { return _.size(provider.prestations); });

        $scope[type + 'Count'] = Object.keys($scope[type]).reduce(function(total, provider) {
            return total + _.size($scope[type][provider].prestations);
        }, 0);
    });

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
    }

    var abtesting = ABTestingService.getEnvironment();
    $scope.newVersionLink = abtesting && abtesting.newVersionLink;
});
