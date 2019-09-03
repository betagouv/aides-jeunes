'use strict';

angular.module('ddsApp').controller('benefitCtaCtrl', function($scope) {
    var types = ['teleservice', 'form', 'instructions'];
    $scope.levels = ['success', 'default'];

    $scope.ctas = types.map(function(type) {
        return {
            type: type,
            link: $scope.benefit[type],
        };
    }).filter(function(item) {
        return item.link;
    }).slice(0, 2);
});

var typeLabels = {
    teleservice: 'Faire une demande en ligne',
    form: 'Accéder au formulaire papier',
    instructions: 'Accéder aux instructions',
    link: "Plus d'informations <i class='fa fa-external-link' aria-hidden='true' role='presentation'></i>",
};

angular.module('ddsApp').controller('benefitCtaLinkCtrl', function($scope, $state, SituationService, TrampolineService) {
    $scope.label = typeLabels[$scope.type];
    $scope.level = $scope.level || 'success';

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
        templateUrl: '/partials/resultat/benefit-cta.html',
        scope: {
            benefit: '='
        },
        controller: 'benefitCtaCtrl',
    };
});

angular.module('ddsApp').directive('benefitCtaLink', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/resultat/benefit-cta-link.html',
        scope: {
            analyticsName: '=',
            level: '<',
            link: '=',
            type: '=',
        },
        controller: 'benefitCtaLinkCtrl',
    };
});
