'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $stateParams, $state, ressourceTypes, SituationService) {

    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    var individuIndex = parseInt($stateParams.individu);
    $scope.individu = $scope.situation.individus[individuIndex];
    $scope.ressources = extractIndividuRessources($scope.individu);

    function extractIndividuRessources (individu) {
        var result = [];
        var ressources = individu.ressources || [];
        var types = _.chain(ressources).pluck('type').unique().filter(function(type) {
            return ! _.contains(['pensionsAlimentairesVersees'], type);
        });

        types.forEach(function(type) {
            // on ignore les types de ressources autres que ceux déclarés dans ressourceTypes (par ex. les ressources année - 2)
            var ressourceType = _.find(ressourceTypes, { id: type });
            if (! ressourceType) {
                return;
            }
            var montantsMensuels = _.map($scope.months, function(month) {
                var ressource = _.find(ressources, { periode: month.id, type: type });
                return ressource ? Math.round(ressource.montant) : 0;
            });

            var montantAnnuel = _.chain(ressources)
                .where({ type: type })
                .pluck('montant')
                .reduce(function(sum, montant) {
                    return sum + montant;
                })
                .value();
            montantAnnuel = Math.round(montantAnnuel);

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

    $scope.getPageTitle = function (individu) {
        switch (individu.role) {
            case 'demandeur':
                return 'Vos ressources';
            case 'conjoint':
                return 'Les ressources de votre conjoint';
            default:
                return 'Les ressources de ' + individu.firstName;
        }
    }

    $scope.declareNextIndividuResources = function () {
        var isLastIndividu = (individuIndex + 1 == $scope.situation.individus.length);
        if (isLastIndividu) { // If this is the last person
            $scope.$emit('ressources');
        } else {
            $state.go('foyer.ressources.types', { individu: individuIndex + 1 });
        }
    };

});
