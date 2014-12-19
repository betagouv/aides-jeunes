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
            $scope.sref = function(individu) {
                switch (individu.role) {
                    case 'demandeur':
                        return 'foyer.demandeur';
                    case 'conjoint':
                        return 'foyer.conjoint';
                    case 'enfant':
                    case 'personneACharge':
                        return 'foyer.personnesACharge';
                }
            };
        }
    };
});
