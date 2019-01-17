'use strict';

angular.module('ddsApp').controller('droitsEligiblesListCtrl', function($scope) {

    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
    $scope.list = [];

    $scope.$watch('droits', function(value) {
        if (value) {
            if ($scope.filter) {
                value = _.filter(value, function(value) {
                    return _.includes($scope.filter, value.id);
                });
            }
            $scope.list = value;
        }
    });

    $scope.shouldDisplayYM2Warning = function(droit) {
        return droit.isBaseRessourcesYearMoins2 && ! $scope.ressourcesYearMoins2Captured && ! _.isString(droit.montant);
    };
});

var controllerOptions = function(templateUrl) {
    return function() {
        return {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
                droits: '=',
                filter: '=',
                patrimoineCaptured: '=',
                ressourcesYearMoins2Captured: '=',
                yearMoins2: '=',
            },
            controller: 'droitsEligiblesListCtrl',
        };
    };
};

angular.module('ddsApp')
    .directive('droitEligiblesList', controllerOptions('/partials/droits-eligibles-list.html'));

angular.module('ddsApp')
    .directive('droitNonEligiblesList', controllerOptions('/partials/droits-non-eligibles-list.html'));

angular.module('ddsApp')
    .directive('droitEligiblesAccordion', controllerOptions('/partials/droits-eligibles-accordion.html'));
