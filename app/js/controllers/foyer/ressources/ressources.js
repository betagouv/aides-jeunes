'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $state, ressourceTypes, categoriesRnc, SituationService, IndividuService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    var momentFinAnnee = moment($scope.situation.dateDeValeur).startOf('month').subtract('months', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
    $scope.finAnneeGlissante = momentFinAnnee.format('MMMM YYYY');
    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    $scope.yearMoinsUn = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');

    var extractIndividuSelectedRessourceTypes = function(individu) {
        var result = {};
        var ressources = individu.ressources || [];
        _.chain(ressources)
            .pluck('type')
            .unique()
            .forEach(function(ressourceType) { result[ressourceType] = true; });

        if (individu.caMicroEntreprise) {
            result.caMicroEntreprise = true;
        }

        if (individu.autresRevenusTns) {
            result.autresRevenusTns = true;
        }

        return result;
    };

    var extractIndividuRessources = function(individu) {
        var result = [];
        var ressources = individu.ressources || [];
        var types = _.chain(ressources).pluck('type').unique().filter(function(type) {
            return !_.contains(['pensionsAlimentaires', 'pensionsAlimentairesVersees'], type);
        });
        types.forEach(function(type) {
            // on ignore les types de ressources autres que ceux déclarés dans ressourceTypes (par ex. les ressources année - 2)
            var ressourceType = _.find(ressourceTypes, { id: type });
            if (!ressourceType) {
                return;
            }

            var montantsMensuels = _.map($scope.months, function(month) {
                var ressource = _.find(ressources, { periode: month.id, type: type });
                return ressource ? Math.round(ressource.montant) : 0;
            });

            var montantAnnuel = _.chain(ressources)
                .where({ type: type })
                .pluck('montant')
                .reduce(function(sum, num) {
                    return sum + num;
                })
                .value();
            montantAnnuel = Math.round(montantAnnuel);

            var ressource = {
                type: ressourceType,
                montantsMensuels: montantsMensuels,
                montantAnnuel: montantAnnuel,
                onGoing: true
            };

            if (_.contains(individu.interruptedRessources, type)) {
                ressource.onGoing = false;
            }

            result.push(ressource);
        });

        if (individu.caMicroEntreprise) {
            result.push({
                type: _.find(ressourceTypes, { id: 'caMicroEntreprise' }),
                tnsStructureType: individu.tnsStructureType,
                tnsActiviteType: individu.tnsActiviteType,
                montantAnnuel: individu.caMicroEntreprise
            });
        }

        if (individu.autresRevenusTns) {
            result.push({
                type: _.find(ressourceTypes, { id: 'autresRevenusTns' }),
                montantAnnuel: individu.autresRevenusTns
            });
        }

        return result;
    };

    $scope.individusVM = _.map($scope.situation.individus, function(individu) {
        return {
            individu: individu,
            label: IndividuService.label(individu),
            selectedRessourceTypes: extractIndividuSelectedRessourceTypes(individu),
            ressources: extractIndividuRessources(individu)
        };
    });

    $scope.isRessourceTypeNonTns = function(ressource) {
        return 'tns' !== ressource.category;
    };

    $scope.isRessourceTypeMicroTns = function(ressource) {
        return 'tns' === ressource.category && 'autresRevenusTns' !== ressource.id;
    };

    $scope.isRessourceNonTns = function(ressource) {
        return $scope.isRessourceTypeNonTns(ressource.type);
    };

    $scope.isRessourceMicroTns = function(ressource) {
        return $scope.isRessourceTypeMicroTns(ressource.type);
    };

    $scope.isRessourceOtherTns = function(ressource) {
        return 'autresRevenusTns' === ressource.type.id;
    };

    $scope.montantInvalide = function(montant) {
        return !angular.isNumber(montant);
    };

    var applyIndividuVMRessourcesToIndividu = function(individuVM) {
        var individu = individuVM.individu;
        var previousRessources = individu.ressources;
        individu.ressources = [];
        individu.interruptedRessources = [];
        individuVM.ressources.forEach(function(ressource) {
            if ('tns' === ressource.type.category) {
                if ('caMicroEntreprise' === ressource.type.id) {
                    individu.tnsStructureType = ressource.tnsStructureType;
                    individu.tnsActiviteType = ressource.tnsActiviteType;
                    individu.caMicroEntreprise = ressource.montantAnnuel;
                } else if ('autresRevenusTns' === ressource.type.id) {
                    individu.autresRevenusTns = ressource.montantAnnuel;
                }
            } else {
                var somme3DerniersMois = 0;
                // injection des valeurs des 3 derniers mois
                [2, 1, 0].forEach(function(i) {
                    var montant = ressource.montantsMensuels[i];
                    somme3DerniersMois += montant;
                    individu.ressources.push({
                        type: ressource.type.id,
                        periode: $scope.months[i].id,
                        montant: montant
                    });
                });

                // injection du montant annuel étalé sur les 9 mois restants
                var montantMensuelEtale = (ressource.montantAnnuel - somme3DerniersMois) / 9;
                for (var j = 0; j < 9; j++) {
                    var periode = moment($scope.situation.dateDeValeur).subtract(4 + j, 'months').format('YYYY-MM');
                    individu.ressources.push({
                        type: ressource.type.id,
                        periode: periode,
                        montant: montantMensuelEtale
                    });
                }

                if (!ressource.onGoing) {
                    individu.interruptedRessources.push(ressource.type.id);
                }
            }
        });

        // on réinjecte les ressources RNC & pensions alimentaires
        individu.ressources = individu.ressources.concat(_.where(previousRessources, function(ressource) {
            return !!_.find(categoriesRnc, { id: ressource.type }) || _.contains(['pensionsAlimentaires', 'pensionsAlimentairesVersees'], ressource.type);
        }));

        // on supprime les revenus TNS si désélectionnés
        if (individu.caMicroEntreprise && !individuVM.selectedRessourceTypes.caMicroEntreprise) {
            individu.caMicroEntreprise = null;
        }

        if (individu.autresRevenusTns && !individuVM.selectedRessourceTypes.autresRevenusTns) {
            individu.autresRevenusTns = null;
        }
    };

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            $scope.individusVM.forEach(applyIndividuVMRessourcesToIndividu);
            $scope.$emit('ressources');
        }
    };
});
