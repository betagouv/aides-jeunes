'use strict';

angular.module('ddsApp').controller('droitsCtaCtrl', function($scope, $state, SituationService, TrampolineService) {
    $scope.getActionURL = function(droit) {
        var action = droit.teleservice || droit.form || droit.instructions;

        if (typeof action === 'object') {
            return $state.href(action.state, action.params);
        }

        return action;
    };

    $scope.onClick = function(droit) {
        var action = droit.teleservice || droit.form || droit.instructions;

        if (typeof action === 'object') {
            var situation = SituationService.restoreLocal();
            TrampolineService.set({ situationId: situation._id });
        }
    };
});

angular.module('ddsApp').directive('droitCta', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/droit-cta.html',
        scope: {
            droit: '='
        },
        controller: 'droitsCtaCtrl',
    };
});
