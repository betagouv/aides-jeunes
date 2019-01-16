'use strict';

var controllerOptions = function(templateUrl) {
    return function() {
        return {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: true,
            controller: 'droitsEligiblesListCtrl',
            // Inject list into scope, filtered by benefits specified via the "filter" attribute
            link: function ($scope, $element, $attributes) {
                if ($attributes.hasOwnProperty('filter')) {
                    var filter = $scope.$eval($attributes.filter);
                    $scope.list = _.pickBy($scope.$eval($attributes.list), function(value, key) {
                        return _.includes(filter, key);
                    });
                } else {
                    $scope.list = $scope.$eval($attributes.list);
                }
            }
        };
    };
};

angular.module('ddsApp')
    .directive('droitEligiblesList', controllerOptions('/partials/droits-eligibles-list.html'));

angular.module('ddsApp')
    .directive('droitNonEligiblesList', controllerOptions('/partials/droits-non-eligibles-list.html'));

angular.module('ddsApp').controller('droitsEligiblesListCtrl', function($scope, TrampolineService) {
    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
    $scope.shouldDisplayYM2Warning = function(droit) {
        return droit.isBaseRessourcesYearMoins2 && ! $scope.ressourcesYearMoins2Captured && ! _.isString(droit.montant);
    };

    $scope.trampoline = TrampolineService;
});
