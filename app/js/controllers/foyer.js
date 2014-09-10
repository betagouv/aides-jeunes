'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $location, $modal, $state, $timeout, SituationService, IndividuService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.statutsSpecifiques = IndividuService.formatStatutsSpecifiques;
    $scope.goToSimulation = function() {
        SituationService.create($scope.situation).then(function(situation) {
            $scope.situation._id = situation._id;
            $state.go('resultat', {'situationId': situation._id});
        });
    };
});
