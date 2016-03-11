'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $state, ressourceTypes, categoriesRnc, SituationService, IndividuService, RessourceService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    $scope.yearMoinsUn = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');

    // Pour les Auto-entrepreneurs
    $scope.onGoingLabel = 'J’aurai un chiffre d’affaires non nul en ' + $scope.currentMonth;

    $scope.ressourceTypes = _.indexBy(ressourceTypes, 'id');

    var extractIndividuSelectedRessourceTypes = function(individu) {
        var result = {};
        var ressources = individu.ressources || [];
        _.chain(ressources)
            .pluck('type')
            .unique()
            .forEach(function(ressourceType) { result[ressourceType] = true; });

        ['caMicroEntreprise', 'caAutoEntrepreneur', 'revenusAgricolesTns', 'autresRevenusTns'].forEach(function(ressourceType) {
            if (individu[ressourceType]) {
                result[ressourceType] = true;
            }
        });

        return result;
    };

    var extractIndividuRessources = function(individu) {
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
    };

    $scope.individusVM = SituationService.getIndividusSortedParentsFirst($scope.situation)
    .map(function(individu) {
        return {
            individu: individu,
            label: IndividuService.label(individu),
            selectedRessourceTypes: extractIndividuSelectedRessourceTypes(individu),
            ressources: extractIndividuRessources(individu)
        };
    });

    $scope.isNumber = angular.isNumber;

    var applyIndividuVMRessourcesToIndividu = function(individuVM) {
        var individu = individuVM.individu;
        var previousRessources = individu.ressources;
        individu.ressources = [];
        individu.interruptedRessources = [];

        individuVM.ressources.forEach(function(ressource) {
            // Ressources for which we have the last 3 months values
            if (ressource.type.category != 'rpns' || ressource.type.id == 'caAutoEntrepreneur') {
                RessourceService.spreadIndividuRessources(individu, $scope.months, ressource, $scope.situation.dateDeValeur);
            // Ressources for which we have only yearly values
            } else {
                RessourceService.applyYearlyRessource(individu, ressource, $scope.situation.dateDeValeur);
            }
        });

        // on réinjecte les ressources RNC & pensions alimentaires
        individu.ressources = individu.ressources.concat(_.where(previousRessources, function(ressource) {
            return !! _.find(categoriesRnc, { id: ressource.type }) || _.contains(['pensionsAlimentairesVersees'], ressource.type);
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
