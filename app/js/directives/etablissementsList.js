'use strict';

angular.module('ddsApp').directive('etablissementsList', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/etablissements-list.html',
        scope: {
            codeCommune: '=',
            codePostal: '='
        },
        controller: 'etablissementsListCtrl',
    };
});

angular.module('ddsApp').controller('etablissementsListCtrl', function($http, $interval, $scope, EtablissementService, SituationService) {
    function getEtablissements(newValues, oldValues, scope) {
        if (! scope || ! scope.codeCommune || ! scope.codePostal) {
            return;
        }

        var situation = SituationService.restoreLocal();

        EtablissementService
            .getEtablissements(situation, scope.codePostal, scope.codeCommune)
            .then(function (etablissements) {
                scope.etablissements = etablissements;
            });
    }

    $scope.$watchGroup(['codeCommune', 'codePostal'], getEtablissements);

    $scope.extractHHMM = function(dateString) {
        return dateString.slice(0,5);
    };

    getEtablissements();
});
