'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $location, $modal, $state, $timeout, SituationService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.statutsSpecifiques = function(individu) {
        return SituationService.formatStatutsSpecifiques(individu);
    };
});
