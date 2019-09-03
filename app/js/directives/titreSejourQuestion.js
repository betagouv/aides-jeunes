'use strict';

var choices = { // Values in years
    ue: [{
        value: 2/12,
        default: true,
        label: 'Moins de 3 mois'
    },{
        value: 4,
        label: 'Entre 3 mois et 5 ans'
    },{
        value: 10,
        label: 'Plus de 5 ans'
    }],
    autre: [{
        value: 5,
        default: true,
        label: 'Moins de 5 ans'
    },{
        value: 9,
        label: 'Entre 5 et 10 ans'
    },{
        value: 20,
        label: 'Plus de 10 ans'
    }]
};

angular.module('ddsCommon').directive('titreSejourQuestion', function(NationaliteService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/titre-sejour-question.html',
        scope: {
            individu: '=',
        },
        link(scope) {
            scope.$watchGroup(['individu', 'individu.nationalite'], function() {
                var individu = scope.individu;
                scope.choices = choices[NationaliteService.getZone(individu.nationalite)] || [];
                var currentIsValid = scope.choices.find(function(v) { return v.value == individu.duree_possession_titre_sejour; });
                if (! currentIsValid) {
                    var defaultValue = scope.choices.find(function(v) { return v.default; });
                    if (defaultValue) {
                        individu.duree_possession_titre_sejour = defaultValue.value;
                    }
                }
            });
        },
    };
});
