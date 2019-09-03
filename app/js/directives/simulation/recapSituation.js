'use strict';

angular.module('ddsRecapSituation').directive('recapSituation', function(SituationService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/resultat/recap-situation.html',
        scope: {
            situation: '='
        },
        controller: function($scope) {
            $scope.situationYAML = SituationService.YAMLRepresentation($scope.situation);
        }
    };
});
