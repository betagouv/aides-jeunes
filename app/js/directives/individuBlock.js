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
            var sref = function(individu) {
                switch (individu.role) {
                    case 'demandeur':
                        return 'foyer.demandeur';
                    case 'conjoint':
                        return 'foyer.conjoint';
                    default:
                        return 'foyer.enfants';
                }
            };

            $scope.sref = sref($scope.individu);
        }
    };
});
