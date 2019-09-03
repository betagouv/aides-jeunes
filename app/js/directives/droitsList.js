'use strict';

angular.module('ddsApp').directive('droitsList', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/resultat/droits/droits-list.html',
        scope: {
            droits: '='
        }
    };
});
