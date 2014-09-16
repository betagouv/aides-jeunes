'use strict';

angular.module('ddsApp').controller('FormInfosComplementairesSituationProCtrl', function($scope, $state, $stateParams, situationsPro, situation, SituationService) {
    $scope.situation = situation;
    $scope.situationsPro = situationsPro;

    $scope.individusRef = [{id: 'demandeur', label: 'Vous', individu: situation.demandeur, situationsPro: []}];
    if (situation.conjoint) {
        $scope.individusRef.push({id: 'conjoint', label: 'Votre partenaire', individu: situation.conjoint, situationsPro: []});
    }

    $scope.individusRef.forEach(function(individuRef) {
        $scope.situationsPro.forEach(function(situationPro) {
            var situationProIndividu = _.find(individuRef.individu.situationsPro, {situation: situationPro.id});
            if (situationProIndividu) {
                situationProIndividu.selected = true;
                situationProIndividu.label = situationPro.label;
                individuRef.situationsPro.push(situationProIndividu);
            } else {
                individuRef.situationsPro.push({situation: situationPro.id, label: situationPro.label, selected: false});
            }
        });
    });

    $scope.submit = function() {
        $scope.individusRef.forEach(function(individuRef) {
            individuRef.individu.situationsPro = _.filter(individuRef.situationsPro, 'selected');
        });

        SituationService.update(situation).then(function() {
            situation.infosComplementairesCaptured = true;
            $state.go('download_cerfa', {droit: $stateParams.droit});
        });
    };
});
