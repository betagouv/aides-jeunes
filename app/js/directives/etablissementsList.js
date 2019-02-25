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
    function getEtablissements() {
        if (! $scope.codePostal) {
            return;
        }

        var situation = SituationService.restoreLocal();

        EtablissementService
            .getEtablissements(situation, $scope.codePostal, $scope.codeCommune)
            .then(function (etablissements) {
                $scope.etablissements = etablissements;
            });
    }

    ['codeCommune', 'codePostal'].forEach(function(key) {
        $scope.$watch(key, getEtablissements);
    });

    $scope.extractHHMM = function(dateString) {
        return dateString.slice(0,5);
    };

    getEtablissements();
});
