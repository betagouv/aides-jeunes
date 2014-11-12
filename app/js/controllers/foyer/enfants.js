'use strict';

angular.module('ddsApp').controller('FoyerEnfantsCtrl', function($scope, $location, $timeout, $anchorScroll, SituationService) {
    var situation = SituationService.restoreLocal();
    $scope.enfants = _.where(situation.individus, { role: 'enfant' });

    $scope.$on('individu.enfant', function(e, enfant) {
        $scope.enfants.push(enfant);
        $scope.ajoutEnfant = false;
    });

    $scope.newEnfant = function() {
        $scope.ajoutEnfant = true;
        $location.hash('form-new-enfant');
        $timeout(function() {
            $anchorScroll();
        });
    };

    $scope.removeEnfant = function(enfant) {
        var index = $scope.enfants.indexOf(enfant);
        $scope.enfants.splice(index, 1);
    };

    $scope.validate = function() {
        $scope.$emit('enfants', $scope.enfants);
    };
});
