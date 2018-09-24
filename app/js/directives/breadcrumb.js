'use strict';

var steps = [
    'foyer.demandeur',
    'foyer.enfants',
    'foyer.conjoint',
    'foyer.logement',
    'foyer.ressources',
    'foyer.pensionsAlimentaires',
    'foyer.resultat',
];

function matchStep(state, step) {
    return state.name.match(new RegExp('^' + step));
}

angular.module('ddsApp').directive('breadcrumb', function($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'partials/breadcrumb.html',
        controller: function($scope, $state) {

            // @see https://ui-router.github.io/guide/ng1/migrate-to-1_0#state-change-events
            $rootScope.$on('$stateChangeSuccess', function(event, toState) {
                var stepIndex = _.findIndex(steps, matchStep.bind(null, toState));
                if (-1 !== stepIndex) {
                    $scope.step = steps[stepIndex];
                    var prevStep = steps[stepIndex - 1];
                    $scope.steps.push(prevStep);
                }
            });

            $scope.steps = [];

            var stepIndex = _.findIndex(steps, matchStep.bind(null, $state.current));
            if (-1 !== stepIndex) {
                $scope.step = steps[stepIndex];
                for (var i = 0; i < stepIndex; i ++) {
                    $scope.steps.push(steps[i]);
                }
            }
        }
    };
});
