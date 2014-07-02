'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function ($scope, $location, $modal, SituationService) {
    $scope.situation = SituationService.restoreLocal() || {};
    if (!$scope.situation.children) {
      $scope.situation.children = [];
    }
    if (!$scope.situation.personnes) {
        $scope.situation.personnes = [];
    }

    $scope.relationTypeLabels = {
        mariage: 'marié(e)',
        pacs: 'pacsé(e)',
        relationLibre: 'en relation libre'
    };

    $scope.openDemandeurModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/conjoint-modal.html',
            controller: 'ConjointModalCtrl',
            backdrop: 'static',
            resolve: {
                individuType: function() {
                    return 'demandeur';
                }
            }
        });

        modalInstance.result.then(function(demandeur) {
            $scope.situation.demandeur = demandeur;
            SituationService.saveLocal($scope.situation);
        });
    };

    if (!$scope.situation.demandeur) {
        $scope.openDemandeurModal();
    }

    $scope.openConjointModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/conjoint-modal.html',
            controller: 'ConjointModalCtrl',
            backdrop: 'static',
            resolve: {
                individuType: function() {
                    return 'conjoint';
                }
            }
        });

        modalInstance.result.then(function(conjoint) {
            $scope.situation.conjoint = conjoint;
        });
    };

    $scope.newChild = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/child-modal.html',
            controller: 'ChildModalCtrl',
            backdrop: 'static',
            resolve: {
                modalTitle: function() {
                    return 'Votre enfant';
                }
            }
        });

        modalInstance.result.then(function(child) {
            $scope.situation.children.push(child);
        });
    };

    $scope.removeChild = function(child) {
        var index = $scope.situation.children.indexOf(child);
        $scope.situation.children.splice(index, 1);
        if (0 === $scope.situation.children.length) {
            $scope.situation.hasChildren = undefined;
        }
    };

    $scope.endChildConfig = function() {
        $scope.childConfigDone = true;
        if ($scope.situation.children.length === 0) {
            $scope.situation.hasChildren = false;
        }
    };

    $scope.newPersonneACharge = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/child-modal.html',
            controller: 'ChildModalCtrl',
            backdrop: 'static',
            resolve: {
                modalTitle: function() {
                    return 'Personne à charge';
                }
            }
        });

        modalInstance.result.then(function(personne) {
            $scope.situation.personnes.push(personne);
        });
    };

    $scope.removePersonneACharge = function(personne) {
        var index = $scope.situation.personnes.indexOf(personne);
        $scope.situation.personnes.splice(index, 1);
        if (0 === $scope.situation.personnes.length) {
            $scope.situation.hasPersonneACharge = undefined;
        }
    };

    $scope.endPersonneAChargeConfig = function() {
        $scope.personneAChargeConfigDone = true;
        if ($scope.situation.personnes.length === 0) {
            $scope.situation.hasPersonneACharge = false;
        }
    };

    $scope.saveSituation = function() {
        SituationService.saveLocal($scope.situation);
    };
});
