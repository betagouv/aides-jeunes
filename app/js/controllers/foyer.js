'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function ($scope, $location, $modal, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.typeRelationLabels = ['marié(e)', 'pacsé(e)', 'en relation libre'];

    $scope.openConjointModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/conjoint-modal.html',
            controller: 'ConjointModalCtrl',
            backdrop: 'static',
        });

        modalInstance.result.then(function(conjoint) {
            $scope.conjoint = conjoint;
        });
    };

    $scope.children = [];
    $scope.personnes = [];

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
            $scope.children.push(child);
        });
    };

    $scope.removeChild = function(child) {
        var index = $scope.children.indexOf(child);
        $scope.children.splice(index, 1);
        if (0 === $scope.children.length) {
            $scope.hasChildren = undefined;
        }
    };

    $scope.endChildConfig = function() {
        $scope.childConfigDone = true;
        if ($scope.children.length === 0) {
            $scope.hasChildren = false;
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
            $scope.personnes.push(personne);
        });
    };

    $scope.removePersonneACharge = function(personne) {
        var index = $scope.personnes.indexOf(personne);
        $scope.personnes.splice(index, 1);
        if (0 === $scope.personnes.length) {
            $scope.hasPersonneACharge = undefined;
        }
    };

    $scope.endPersonneAChargeConfig = function() {
        $scope.personneAChargeConfigDone = true;
        if ($scope.personnes.length === 0) {
            $scope.hasPersonneACharge = false;
        }
    };

    $scope.saveSituation = function() {
        if ($scope.conjoint) {
            $scope.situation.conjoint = $scope.conjoint;
        }

        $scope.situation.children = $scope.children;
        $scope.situation.personnes = $scope.personnes;
        SituationService.saveLocal($scope.situation);
    };
});
