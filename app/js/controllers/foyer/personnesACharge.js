'use strict';

angular.module('ddsApp').controller('FoyerPersonnesAChargeCtrl', function($scope, $location, $anchorScroll, $timeout) {
    $scope.enfants = _.where($scope.situation.individus, { role: 'enfant' });

    $scope.$on('individu.enfant', function(e, enfant) {
        $scope.enfants.push(enfant);
        $scope.displayForm = false;
    });

    $scope.$on('actionCancelled', function() {
        $scope.displayForm = false;
    });

    $scope.newEnfant = function() {
        $scope.displayForm = true;
        $timeout(function() {
            $location.hash('form-scroll');
            $anchorScroll();
        });
    };

    $scope.removeEnfant = function(enfant) {
        var index = $scope.enfants.indexOf(enfant);
        $scope.enfants.splice(index, 1);
    };

    $scope.validate = function() {
        $scope.$emit('personnesACharge', $scope.enfants);
    };
});
