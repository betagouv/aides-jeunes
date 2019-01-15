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

angular.module('ddsApp').directive('breadcrumb', function($transitions) {
    return {
        restrict: 'E',
        templateUrl: '/partials/breadcrumb.html',
        controller: function($scope, $state) {

            $transitions.onSuccess({}, function(transition) {
                var stepIndex = _.findIndex(steps, matchStep.bind(null, transition.to()));
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
