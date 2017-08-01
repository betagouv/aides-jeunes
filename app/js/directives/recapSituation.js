'use strict';

angular.module('ddsRecapSituation').directive('recapSituation', function($timeout, $sce, ressourceTypes, categoriesRnc, logementTypes, nationalites, IndividuService, SituationService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/recap-situation.html',
        scope: {
            situation: '='
        },
        controller: function($scope, $filter) {
            $scope.situationYAML = jsyaml.dump(_.omit($scope.situation, '__v'));
        }
    };
});
