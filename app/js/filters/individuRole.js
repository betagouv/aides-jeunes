'use strict';

angular.module('ddsCommon')
    .filter('individuRoleFilter', function() {
        var map = {
            personneACharge: 'Personne à charge',
            enfant: 'Enfant',
            demandeur: 'Demandeur',
            conjoint: 'Conjoint'
        };
        return function(text) {
            if (false === text in map) {
                return undefined;
            }
            return map[text];
        };
    });
