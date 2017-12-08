'use strict';

angular.module('ddsRecapSituation').directive('recapSituation', function(SituationService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/recap-situation.html',
        scope: {
            situation: '='
        },
        controller: function($scope, $filter) {
            $scope.situationYAML = SituationService.YAMLRepresentation($scope.situation);
        }
    };
});
