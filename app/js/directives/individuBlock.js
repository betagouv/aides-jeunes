'use strict';

angular.module('ddsCommon').directive('individuBlock', function(IndividuService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/resultat/individu-block.html',
        scope: {
            individu: '='
        },
        controller: function($scope) {
            $scope.individuLabel = IndividuService.label;
            $scope.nationalite = IndividuService.nationaliteLabel;
            $scope.statutsSpecifiques = IndividuService.formatStatutsSpecifiques;
            var sref = function(individu) {
                switch (individu.role) {
                case 'demandeur':
                    return 'foyer.demandeur';
                case 'conjoint':
                    return 'foyer.conjoint';
                case 'enfant':
                    return 'foyer.enfants.modifier({ id: individu.id })';
                default:
                    return 'foyer.enfants';
                }
            };

            $scope.sref = sref($scope.individu);
        }
    };
});
