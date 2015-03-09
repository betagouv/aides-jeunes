'use strict';

angular.module('ddsApp').controller('FoyerPensionsAlimentairesCtrl', function($scope, ressourceTypes, IndividuService) {
    $scope.recoitPensionsAlimentaires = false;
    $scope.versePensionsAlimentaires = false;

    $scope.pensionsPercues = _.find(ressourceTypes, { id: 'pensionsAlimentaires' });
    $scope.pensionsVersees = { id: 'pensionsAlimentairesVersees', label: 'Pensions alimentaires versées', category: 'pensions' };

    $scope.submit = function() {
        $scope.$emit('pensionsAlimentaires');
    };

    var createIndividuVM = function(individu) {
        return {
            label: IndividuService.label(individu),
            pensionsRecues: {
                montantsMensuels: [0, 0, 0],
                montantAnnuel: 0,
                onGoing: true
            },
            pensionsVersees: {
                montantsMensuels: [0, 0, 0],
                montantAnnuel: 0,
                onGoing: true
            }
        };
    };

    var demandeur = _.find($scope.situation.individus, { role: 'demandeur' });
    var conjoint = _.find($scope.situation.individus, { role: 'conjoint' });
    $scope.individusVM = [createIndividuVM(demandeur)];
    if (conjoint) {
        $scope.individusVM.push(createIndividuVM(conjoint));
    }
});
