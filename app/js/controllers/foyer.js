'use strict';

angular.module('ddsApp').controller('FoyerCtrl', function($scope, $state, $modal, nationalites, SituationService, IndividuService) {
    $scope.situation = SituationService.restoreLocal();
    $scope.statutsSpecifiques = IndividuService.formatStatutsSpecifiques;

    $scope.nationalite = function(individu) {
        return _.find(nationalites, {id: individu.nationalite}).label;
    };

    $scope.goToSimulation = function() {
        SituationService.create($scope.situation).then(function(situation) {
            $scope.situation._id = situation._id;
            $state.go('resultat', {'situationId': situation._id});
        });
    };
});
