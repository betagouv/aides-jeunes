'use strict';

angular.module('ddsApp').directive('droitEligiblesList', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/droits-eligibles-list.html',
        scope: true,
        controller: 'droitsEligiblesListCtrl',
        link: function ($scope, $element, $attributes) {
            $scope.list = $scope.$eval($attributes.list);
        }
    };
});

angular.module('ddsApp').directive('droitNonEligiblesList', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/droits-non-eligibles-list.html',
        scope: true,
        controller: 'droitsEligiblesListCtrl',
        link: function ($scope, $element, $attributes) {
            // Inject list into scope, filtered by benefits specified via the "filter" attribute
            var filter = $scope.$eval($attributes.filter);
            $scope.list = _.pickBy($scope.$eval($attributes.list), function(value, key) {
                return _.includes(filter, key);
            });
        }
    };
});

angular.module('ddsApp').controller('droitsEligiblesListCtrl', function($scope, TrampolineService) {
    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
    $scope.shouldDisplayYM2Warning = function(droit) {
        return droit.isBaseRessourcesYearMoins2 && ! $scope.ressourcesYearMoins2Captured && ! _.isString(droit.montant);
    };

    $scope.trampoline = TrampolineService;

    // ng-class and uib-accordion don't work well together, hence this extra function.
    // See https://github.com/angular-ui/bootstrap/issues/4172
    $scope.getAccordionClass = function(droit) {
        return [$scope.shouldDisplayYM2Warning(droit) ? 'needs-n-2' : '', droit.open ? 'panel-opened': ''].join(' ');
    };
});
