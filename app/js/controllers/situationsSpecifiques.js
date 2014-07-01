'use strict';

angular.module('ddsApp').controller('SituationsSpecifiquesCtrl', function($scope, SituationService) {
    $scope.situations = [
        { id: 'etudiant', label: 'Étudiant' },
        { id: 'demandeurEmploi', label: 'Demandeur d\'emploi' },
        { id: 'retraite', label: 'Retraité' }
    ];

    $scope.selectedSituations = {};

    var situation = SituationService.restoreLocal();
    $scope.individus = SituationService.createIndividusList(situation);
});
