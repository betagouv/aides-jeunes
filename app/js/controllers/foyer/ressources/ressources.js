'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $state, ressourceTypes, SituationService, IndividuService) {
    $scope.momentDebutAnnee = moment().subtract('years', 1);
    $scope.momentFinAnnee = moment().startOf('month').subtract('months', 1);
    $scope.debutAnnee = $scope.momentDebutAnnee.format('MMMM YYYY');
    $scope.finAnnee = $scope.momentFinAnnee.format('MMMM YYYY');
    $scope.ressourceTypes = ressourceTypes;
    $scope.months = SituationService.getMonths();

    $scope.individuRefs = _.map($scope.situation.individus, function(individu) {
        return {
            label: IndividuService.label(individu),
            selectedRessourceTypes: {},
            ressources: [],
            individu: individu
        };
    });

    $scope.selectedRessourceTypes = {};
    _.chain($scope.situation.individus)
        .flatten('ressources')
        .filter()
        .uniq(false, 'type')
        .pluck('type')
        .forEach(function(ressourceType) { $scope.selectedRessourceTypes[ressourceType] = true; });

    $scope.$on('ressourceTypesValidated', function() {
        var hasSelectedRessources = !!_.filter($scope.selectedRessourceTypes).length;
        if (hasSelectedRessources) {
            if (1 < $scope.individuRefs.length) {
                $state.go('foyer.ressources.personnes');
            } else {
                $scope.individuRefs[0].selectedRessourceTypes = $scope.selectedRessourceTypes;
                $scope.initIndividusRessources();
                $state.go('foyer.ressources.montants');
            }
        } else {
            $state.go('foyer.patrimoine');
        }
    });

    $scope.$on('personnesValidated', function() {
        $scope.initIndividusRessources();
        if (!_.filter($scope.individuRefs, 'hasRessources').length) {
            $state.go('foyer.patrimoine');
            return;
        }
        $state.go('foyer.ressources.montants');
    });

    $scope.$on('montantsValidated', function() {
        $scope.$emit('ressourcesValidated');
    });

    $scope.initIndividusRessources = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            var previousRessources = individuRef.ressources;
            individuRef.ressources = [];
            individuRef.hasRessources = false;
            individuRef.hasRessourcesMicroTns = false;
            individuRef.hasRessourcesOtherTns = false;
            individuRef.hasRessourcesNonTns = false;

            ressourceTypes.forEach(function(ressourceType) {
                if (!individuRef.selectedRessourceTypes[ressourceType.id] || !$scope.selectedRessourceTypes[ressourceType.id]) {
                    return;
                }

                individuRef.hasRessources = true;
                if ('caMicroEntreprise' === ressourceType.id) {
                    individuRef.hasRessourcesMicroTns = true;
                } else if ('autresRevenusTns' === ressourceType.id) {
                    individuRef.hasRessourcesOtherTns = true;
                } else {
                    individuRef.hasRessourcesNonTns = true;
                }

                var ressource = _.find(previousRessources, {type: ressourceType});
                if (!ressource) {
                    ressource = {type: ressourceType};
                    if ('caMicroEntreprise' === ressourceType.id) {
                        ressource.tnsStructureType = 'auto_entrepreneur';
                        ressource.tnsActiviteType = 'bic';
                    }
                    ressource.montantAnnuel = 0;

                    if ('tns' !== ressourceType.category) {
                        ressource.months = [
                            { periode: $scope.months[0].id, montant: 0 },
                            { periode: $scope.months[1].id, montant: 0 },
                            { periode: $scope.months[2].id, montant: 0 }
                        ];
                    }
                }
                individuRef.ressources.push(ressource);
            });
        });
    };
});
