'use strict';

angular.module('ddsApp').controller('benefitCtaCtrl', function($scope, $state, SituationService, TrampolineService) {
    $scope.getActionURL = function(benefit) {
        var action = benefit.teleservice || benefit.form || benefit.instructions;

        if (typeof action === 'object') {
            return $state.href(action.state, action.params);
        }

        return action;
    };

    $scope.onClick = function(benefit) {
        var action = benefit.teleservice || benefit.form || benefit.instructions;

        if (typeof action === 'object') {
            var situation = SituationService.restoreLocal();
            TrampolineService.set({ situationId: situation._id });
        }
    };
});

angular.module('ddsApp').directive('benefitCta', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/benefit-cta.html',
        scope: {
            benefit: '='
        },
        controller: 'benefitCtaCtrl',
    };
});
