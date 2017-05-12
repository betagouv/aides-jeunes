'use strict';

angular.module('ddsApp').controller('FoyerRessourcesIndividuCtrl', function($scope, $state, $stateParams, SituationService, IndividuService, RessourceService, ressourceTypes) {

    function extractIndividuSelectedRessourceTypes (individu) {
        var result = {};
        var ressources = individu.ressources || [];
        _.chain(ressources)
            .map('type')
            .uniq()
            .filter(RessourceService.isRessourceOnMainScreen)
            .forEach(function(ressourceType) { result[ressourceType] = true; })
            .value();

        ['tns_micro_entreprise_chiffre_affaires', 'tns_auto_entrepreneur_chiffre_affaires', 'tns_benefice_exploitant_agricole', 'tns_autres_revenus'].forEach(function(ressourceType) {
            if (individu[ressourceType]) {
                result[ressourceType] = true;
            }
        });

        return result;
    }

    function extractIndividuRessources (individu) {
        var result = [];
        var ressources = individu.ressources || [];
        var types = _.chain(ressources)
            .map('type')
            .uniq()
            .filter(RessourceService.isRessourceOnMainScreen)
            .value();

        types.forEach(function(type) {
            var ressourceType = _.find(ressourceTypes, { id: type });
            var montantsMensuels = _.map($scope.months, function(month) {
                var ressource = _.find(ressources, { periode: month.id, type: type });
                return ressource ? RessourceService.roundToCents(ressource.montant) : 0;
            });

            var montantAnnuel = _.chain(ressources)
                .filter({ type: type })
                .map('montant')
                .reduce(function(sum, montant) {
                    return sum + montant;
                })
                .value();
            montantAnnuel = RessourceService.roundToCents(montantAnnuel);

            var ressource = {
                type: ressourceType,
                montantsMensuels: montantsMensuels,
                montantAnnuel: montantAnnuel,
                onGoing: true
            };

            if (_.includes(individu.interruptedRessources, type)) {
                ressource.onGoing = false;
            }
            result.push(ressource);
        });

        return result;
    }

    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    var individuIndex = parseInt($stateParams.individu);
    $scope.individu = $scope.sortedIndividus[individuIndex];
    $scope.selectedRessourceTypes = extractIndividuSelectedRessourceTypes($scope.individu);
    $scope.ressources = extractIndividuRessources($scope.individu);
    $scope.pageTitle = IndividuService.ressourceHeader($scope.individu);
});
