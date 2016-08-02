'use strict';

angular.module('ddsApp').controller('FoyerRessourcesIndividuCtrl', function($scope, $state, $stateParams, SituationService, IndividuService, RessourceService, ressourceTypes) {

    function extractIndividuSelectedRessourceTypes (individu) {
        var result = {};
        var ressources = individu.ressources || [];
        _.chain(ressources)
            .pluck('type')
            .unique()
            .filter(RessourceService.isRessourceOnMainScreen)
            .forEach(function(ressourceType) { result[ressourceType] = true; });

        ['caMicroEntreprise', 'caAutoEntrepreneur', 'revenusAgricolesTns', 'autresRevenusTns'].forEach(function(ressourceType) {
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
            .pluck('type')
            .unique()
            .filter(RessourceService.isRessourceOnMainScreen)
            .value();

        types.forEach(function(type) {
            var ressourceType = _.find(ressourceTypes, { id: type });
            var montantsMensuels = _.map($scope.months, function(month) {
                var ressource = _.find(ressources, { periode: month.id, type: type });
                return ressource ? RessourceService.roundToCents(ressource.montant) : 0;
            });

            var montantAnnuel = _.chain(ressources)
                .where({ type: type })
                .pluck('montant')
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

            // For autres revenus TNS, we also need to find the CA
            if (type == 'autresRevenusTns') {
                ressource.caAnnuel = _.chain(ressources)
                    .where({ type: 'caAutresRevenusTns' })
                    .pluck('montant')
                    .reduce(function(sum, montant) {
                        return sum + montant;
                    })
                    .value();
            }

            if (_.contains(individu.interruptedRessources, type)) {
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
