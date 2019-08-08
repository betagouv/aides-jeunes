'use strict';

angular.module('ddsApp').controller('droitsEligiblesListCtrl', function($scope, ScrollService) {

    $scope.isBoolean = _.isBoolean;
    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
    $scope.list = [];

    $scope.$watch('droits', function(value) {
        if (value) {
            var list = value;
            if ($scope.filter) {
                list = _.filter(list, function(value) {
                    return _.includes($scope.filter, value.id);
                });
            }
            $scope.list = list;
        }
    });

    $scope.shouldDisplayYM2Warning = function(droit) {
        return droit.isBaseRessourcesYearMoins2 && ! $scope.ressourcesYearMoins2Captured && ! _.isString(droit.montant);
    };

    $scope.scrollTo = function(event, droit) {
        return ScrollService.go(event, document.getElementById(droit.id), document.querySelector('header').offsetHeight);
    };
    $scope.scrollToTop = ScrollService.handler(document.querySelector('body'));
});

angular.module('ddsApp').controller('ppaHelpCtrl', function($scope, $uibModalInstance, SituationService, situation, droit) {
    $scope.situationId = situation._id;
    $scope.droit = droit;

    $scope.isProprietaireAvecPretEnCours =
        SituationService.isProprietaireAvecPretEnCours(situation);
    $scope.isHebergeParticipeFrais =
        SituationService.isHebergeParticipeFrais(situation);

    $scope.closeModal = function () {
        $uibModalInstance.close();
    };
});

var controllerOptions = function(templateUrl) {
    return function() {
        return {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
                city: '=',
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
    .directive('droitEligiblesDetails', controllerOptions('/partials/droits-eligibles-details.html'));

angular.module('ddsApp')
    .directive('droitNonEligiblesList', controllerOptions('/partials/droits-non-eligibles-list.html'));

angular.module('ddsApp')
    .directive('droitMontant', function($uibModal, SituationService) {
        return {
            restrict: 'E',
            templateUrl: '/partials/droit-montant.html',
            scope: {
                droit: '=',
            },
            link: function(scope, element, attributes) {

                scope.isNumber = _.isNumber;
                scope.isString = _.isString;
                scope.getFractionSize = function(droit) {
                    return droit.floorAt < 1 ? 2 : 0;
                };

                var situation = SituationService.restoreLocal();
                var isProprietaireAvecPretEnCours = SituationService.isProprietaireAvecPretEnCours(situation);
                var isHebergeParticipeFrais = SituationService.isHebergeParticipeFrais(situation);
                var isPpa = scope.droit.id === 'ppa';

                scope.showUnexpected = attributes.hasOwnProperty('unexpected') && (isPpa && (isProprietaireAvecPretEnCours || isHebergeParticipeFrais));

                scope.openModal = function() {
                    $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        size: 'lg',
                        templateUrl: '/partials/ppa-help.html',
                        controller: 'ppaHelpCtrl',
                        resolve: {
                            situation: function() {
                                return situation;
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
