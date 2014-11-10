'use strict';

angular.module('ddsApp').directive('individuBlock', function(IndividuService) {
    return {
        restrict: 'E',
        templateUrl: 'partials/individu-block.html',
        scope: {
            individu: '='
        },
        controller: function($scope) {
            $scope.individuLabel = IndividuService.label;
            $scope.nationalite = IndividuService.nationaliteLabel;
        }
    };
});
