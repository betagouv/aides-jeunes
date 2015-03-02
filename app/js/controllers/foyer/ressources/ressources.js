'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $state, ressourceTypes, categoriesRnc, SituationService, IndividuService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    var momentFinAnnee = moment($scope.situation.dateDeValeur).startOf('month').subtract('months', 1);
    $scope.debutAnnee = momentDebutAnnee.format('MMMM YYYY');
    $scope.finAnnee = momentFinAnnee.format('MMMM YYYY');
    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    $scope.yearMoinsUn = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');

    $scope.ressourceTypes = ressourceTypes;

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
        var result = [];
        var ressources = individu.ressources || [];
        var types = _.chain(ressources).pluck('type').unique();
        types.forEach(function(type) {
            // on ignore les types de ressources autres que ceux déclarés dans ressourceTypes (par ex. les ressources année - 2)
            if (!_.find(ressourceTypes, { id: type })) {
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

            result.push({
                type: _.find(ressourceTypes, { id: type }),
                montantsMensuels: montantsMensuels,
                montantAnnuel: montantAnnuel
            });
        });

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

    $scope.updateMontantAnnuel = function(ressource) {
        var somme = ressource.montantsMensuels[0] + ressource.montantsMensuels[1] + ressource.montantsMensuels[2];
        if (!_.isNaN(somme)) {
            ressource.montantAnnuel = Math.round(4 * somme);
        }
    };

    var applyIndividuVMRessourcesToIndividu = function(individuVM) {
        var individu = individuVM.individu;
        var previousRessources = individu.ressources;
        individu.ressources = [];
        individu.interruptedRessources = [];
        individuVM.ressources.forEach(function(ressource) {
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

            /*if ('tns' === ressource.type.category) {
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
                    debutPeriode: momentDebutAnnee.format('YYYY-MM'),
                    finPeriode: momentFinAnnee.format('YYYY-MM')
                });
            }*/

            if (!ressource.onGoing) {
                individu.interruptedRessources.push(ressource.type.id);
            }
        });

        // on réinjecte les ressources RNC
        individu.ressources = individu.ressources.concat(_.where(previousRessources, function(ressource) {
            return !!_.find(categoriesRnc, { id: ressource.type });
        }));
    };

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            $scope.individusVM.forEach(applyIndividuVMRessourcesToIndividu);
            $scope.$emit('ressources');
        }
    };
});
