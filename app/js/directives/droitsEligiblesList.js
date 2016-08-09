'use strict';

angular.module('ddsApp').directive('droitEligiblesList', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/droits-eligibles-list.html',
        scope: true,
        controller: 'droitEligiblesListCtrl',
        link: function ($scope, $element, $attributes) {
            $scope.list = $scope.$eval($attributes.list);
        }
    };
});

angular.module('ddsApp').controller('droitEligiblesListCtrl', function($scope) {
    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
    $scope.round = function(droit) {
        if (! droit.unit && droit.roundToNearest10 !== false) {
            return Math.round(droit.montant / 10) * 10;
        } else {
            return Math.round(droit.montant);
        }
    };
    $scope.shouldDisplayYM2Warning = function(droit) {
        return droit.isBaseRessourcesYearMoins2 && ! $scope.ressourcesYearMoins2Captured && ! _.isString(droit.montant);
    };

    // ng-class and uib-accordion don't work well together, hence this extra function.
    // See https://github.com/angular-ui/bootstrap/issues/4172
    $scope.getAccordionClass = function(droit) {
        return [$scope.shouldDisplayYM2Warning(droit) ? 'result-needs-n-2' : '', droit.open ? 'panel-opened': ''].join(' ');
    };
});
