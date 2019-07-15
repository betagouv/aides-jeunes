'use strict';

angular.module('ddsApp').directive('etablissementsList', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/etablissements-list.html',
        scope: {
            city: '=',
            types: '=',
        },
        controller: 'etablissementsListCtrl',
    };
});

angular.module('ddsApp').controller('etablissementsListCtrl', function($scope, EtablissementService) {
    function getEtablissements(newValues, oldValues, scope) {
        EtablissementService
            .getEtablissements(scope.city, scope.types)
            .then(function (etablissements) {
                scope.etablissements = etablissements;
            });
    }

    $scope.$watch('city', getEtablissements);
    $scope.$watch('types', getEtablissements);
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

angular.module('ddsApp').directive('etablissementsCta', function($analytics, $uibModal, EtablissementService) {
    return {
        restrict: 'E',
        templateUrl: '/partials/etablissements-cta.html',
        scope: {
            city: '=',
            types: '=',
            droit: '='
        },
        link: function(scope) {
            scope.openModal = function() {

                $analytics.eventTrack('openModal', { category: 'Établissements', label: droit.label });

                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    size: 'lg',
                    templateUrl: '/partials/etablissements-modal.html',
                    controller: 'etablissementsModalCtrl',
                    resolve: {
                        etablissements: function() {
                            return EtablissementService.getEtablissements(scope.city, scope.types);
                        },
                        title: function() {
                            return scope.droit.label;
                        }
                    }
                });
            };
        }
    };
});

angular.module('ddsApp').controller('etablissementsModalCtrl', function($scope, $uibModalInstance, etablissements, title) {
    $scope.etablissements = etablissements;
    $scope.title = title;
    $scope.closeModal = function () {
        $uibModalInstance.close();
    };
});
