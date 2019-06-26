'use strict';

angular.module('ddsApp').directive('etablissementsList', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/etablissements-list.html',
        scope: {
            situation: '=',
            droits: '='
        },
        controller: 'etablissementsListCtrl',
    };
});

angular.module('ddsApp').controller('etablissementsListCtrl', function($http, $interval, $scope, EtablissementService) {

    function getEtablissements(newValues, oldValues, scope) {

        if (! scope.droits) {
            return;
        }

        EtablissementService
            .getEtablissements(scope.situation, scope.droits)
            .then(function (etablissements) {
                scope.etablissements = etablissements;
            });
    }

    $scope.$watch('droits', getEtablissements);
});

angular.module('ddsApp').directive('etablissement', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/etablissement.html',
        scope: {
            etablissement: '=',
        },
        link: function(scope) {
            scope.extractHHMM = function(dateString) {
                return dateString.slice(0,5);
            };
        }
    };
});

angular.module('ddsApp').directive('etablissementsCta', function($uibModal, EtablissementService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/etablissements-cta.html',
        scope: {
            situation: '=',
            droits: '=',
            droit: '=',
        },
        link: function(scope) {
            scope.openModal = function() {
                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    size: 'lg',
                    templateUrl: '/partials/etablissements-modal.html',
                    controller: 'etablissementsModalCtrl',
                    resolve: {
                        etablissements: function() {
                            return EtablissementService
                                .getEtablissements(scope.situation, scope.droits);
                        },
                        droit: function() {
                            return scope.droit;
                        }
                    }
                });
            };
        }
    };
});

angular.module('ddsApp').controller('etablissementsModalCtrl', function($scope, droit, etablissements) {
    $scope.etablissements = _.filter(etablissements, function(etablissement) {
        return _.includes(droit.provider.etablissements, etablissement.pivotLocal);
    });
});
