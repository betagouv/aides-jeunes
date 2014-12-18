'use strict';

angular.module('ddsCommon')
    .filter('ressourceCategory', function() {
        var map = {
            allocations: 'Allocations',
            autre: 'Autre',
            indemnites: 'Indemnités',
            pensions: 'Pensions',
            revenusActivite: 'Revenus d\'activité',
            tns: 'Travailleur non salarié'
        };
        return function(text) {
            if (false === text in map) {
                return undefined;
            }
            return map[text];
        };
    });
