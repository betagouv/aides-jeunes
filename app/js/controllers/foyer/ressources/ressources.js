'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $state, ressourceCategories, ressourceTypes, SituationService, IndividuService) {
    $scope.momentDebutAnnee = moment().subtract('years', 1);
    $scope.momentFinAnnee = moment().startOf('month').subtract('months', 1);
    $scope.debutAnnee = $scope.momentDebutAnnee.format('MMMM YYYY');
    $scope.finAnnee = $scope.momentFinAnnee.format('MMMM YYYY');
    $scope.months = SituationService.getMonths();

    $scope.ressourceTypes = ressourceTypes;
    $scope.categories = ressourceCategories;
    $scope.ressourceTypesByCategories = _.groupBy(ressourceTypes, 'category');

    var extractIndividuSelectedRessourceTypes = function(individu) {
        var result = {};
        var ressources = individu.ressources || [];
        _.chain(ressources)
            .pluck('type')
            .unique()
            .forEach(function(ressourceType) { result[ressourceType] = true; });

        return result;
    };

    var extractIndividuRessources = function(individu) {
        var ressources = [];

        if (individu.ressources) {
            individu.ressources.forEach(function(existingRessource) {
                var ressourceType = _.find(ressourceTypes, {id: existingRessource.type});
                if (!ressourceType) {
                    return;
                }

                var ressource = _.find(ressources, { type: ressourceType });

                if (!ressource) {
                    ressource = { type: ressourceType, interrupted: false };
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
                    ressources.push(ressource);
                }
            });
        }

        return ressources;
    };

    var applyIndividuRefRessourcesToIndividu = function(individuRef) {
        var individu = individuRef.individu;
        individu.ressources = [];
        individu.interruptedRessources = [];
        individuRef.ressources.forEach(function(ressource) {
            if (ressource.months) {
                ressource.months.forEach(function(month) {
                    individu.ressources.push({
                        periode: month.periode,
                        type: ressource.type.id,
                        montant: month.montant
                    });
                });
            }

            if ('tns' === ressource.type.category) {
                if ('caMicroEntreprise' === ressource.type.id) {
                    individu.tnsStructureType = ressource.tnsStructureType;
                    individu.tnsActiviteType = ressource.tnsActiviteType;
                    individu.caMicroEntreprise = ressource.montantAnnuel;
                } else if ('autresRevenusTns' === ressource.type.id) {
                    individu.autresRevenusTns = ressource.montantAnnuel;
                }
            } else {
                individu.ressources.push({
                    type: ressource.type.id,
                    montant: ressource.montantAnnuel,
                    debutPeriode: $scope.momentDebutAnnee.format('YYYY-MM'),
                    finPeriode: $scope.momentFinAnnee.format('YYYY-MM')
                });
            }

            if (ressource.interrupted) {
                individu.interruptedRessources.push(ressource.type.id);
            }
        });
    };

    $scope.individuRefs = _.map($scope.situation.individus, function(individu) {
        return {
            individu: individu,
            label: IndividuService.label(individu),
            selectedRessourceTypes: extractIndividuSelectedRessourceTypes(individu),
            ressources: extractIndividuRessources(individu)
        };
    });

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            _.forEach($scope.individuRefs, applyIndividuRefRessourcesToIndividu);
            $scope.$emit('ressourcesValidated');
        }
    };
});
