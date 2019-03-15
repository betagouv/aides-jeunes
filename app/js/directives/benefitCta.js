'use strict';

angular.module('ddsApp').controller('benefitCtaCtrl', function($scope) {
    var types = ['teleservice', 'form', 'instructions'];

    var type = types.reduce(function(value, type) {
        return value || ($scope.benefit[type] && type);
    }, false);
    $scope.link = $scope.benefit[type];
    $scope.type = type;
});

var typeLabels = {
    teleservice: 'Faire une demande',
    form: 'Accéder au formulaire',
    instructions: 'Accéder aux instructions'
};

angular.module('ddsApp').controller('benefitCtaLinkCtrl', function($scope, $state, SituationService, TrampolineService) {
    $scope.label = typeLabels[$scope.type];

    $scope.getURL = function(link) {
        if (typeof link === 'object') {
            return $state.href(link.state, link.params);
        }

        return link;
    };

    $scope.onClick = function(link) {
        if (typeof link === 'object') {
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

angular.module('ddsApp').directive('benefitCtaLink', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/benefit-cta-link.html',
        scope: {
            analyticsName: '=',
            link: '=',
            type: '=',
        },
        controller: 'benefitCtaLinkCtrl',
    };
});
