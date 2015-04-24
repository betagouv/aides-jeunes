'use strict';

angular.module('ddsApp').controller('FoyerRessourcesCtrl', function($scope, $state, ressourceTypes, categoriesRnc, SituationService, IndividuService, RessourceService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    var momentFinAnnee = moment($scope.situation.dateDeValeur).startOf('month').subtract('months', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
    $scope.finAnneeGlissante = momentFinAnnee.format('MMMM YYYY');
    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    $scope.yearMoinsUn = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');
    $scope.onGoingLabel = 'Je continuerai à percevoir cette ressource en ' + $scope.currentMonth;

    $scope.ressourceTypes = _.indexBy(ressourceTypes, 'id');

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

        if (individu.caAutoEntrepreneur) {
            result.caAutoEntrepreneur = true;
        }

        if (individu.revenusAgricolesTns) {
            result.revenusAgricolesTns = true;
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
            return !_.contains(['pensionsAlimentairesVersees'], type);
        });

        types.forEach(function(type) {
            if (type === 'caAutoEntrepreneur') {
                return;
            }
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
                tnsActiviteType: individu.microEntrepriseActiviteType,
                montantAnnuel: individu.caMicroEntreprise,
                employes: individu.microEntrepriseEmployes
            });
        }

        if (individu.caAutoEntrepreneur) {

            var montantsMensuels = _.map($scope.months, function(month) {
                var ressource = _.find(ressources, { periode: month.id, type: 'caAutoEntrepreneur' });
                return ressource ? Math.round(ressource.montant) : 0;
            });

            result.push({
                type: _.find(ressourceTypes, { id: 'caAutoEntrepreneur' }),
                tnsActiviteType: individu.autoEntrepreneurActiviteType,
                montantAnnuel: individu.caAutoEntrepreneur,
                montantsMensuels: montantsMensuels,
                employes: individu.autoEntrepreneurEmployes,
                onGoing: !_.contains(individu.interruptedRessources, 'caAutoEntrepreneur')
            });
        }

        if (individu.autresRevenusTns) {
            result.push({
                type: _.find(ressourceTypes, { id: 'autresRevenusTns' }),
                montantAnnuel: individu.autresRevenusTns,
                employes: individu.autresRevenusTnsEmployes
            });
        }

        if (individu.revenusAgricolesTns) {
            result.push({
                type: _.find(ressourceTypes, { id: 'revenusAgricoles' }),
                montantAnnuel: individu.revenusAgricolesTns,
                employes: individu.revenusAgricolesTnsEmployes
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
                switch (ressource.type.id) {
                    case 'autresRevenusTns':
                        individu.autresRevenusTns = ressource.montantAnnuel;
                        individu.autresRevenusTnsEmployes = ressource.employes;
                        break;
                    case 'revenusAgricoles':
                        individu.revenusAgricolesTns = ressource.montantAnnuel;
                        individu.revenusAgricolesTnsEmployes = ressource.employes;
                        break;
                    case 'caAutoEntrepreneur':
                        individu.autoEntrepreneurActiviteType = ressource.tnsActiviteType;
                        individu.caAutoEntrepreneur = ressource.montantAnnuel;
                        individu.autoEntrepreneurEmployes = ressource.employes;
                        RessourceService.spreadIndividuRessources(individu, $scope.months, ressource, $scope.situation.dateDeValeur);
                        break;
                    case 'caMicroEntreprise':
                        individu.microEntrepriseActiviteType = ressource.tnsActiviteType;
                        individu.caMicroEntreprise = ressource.montantAnnuel;
                        individu.microEntrepriseEmployes = ressource.employes;
                        break;
                }
            } else {
                RessourceService.spreadIndividuRessources(individu, $scope.months, ressource, $scope.situation.dateDeValeur);
            }
        });

        // on réinjecte les ressources RNC & pensions alimentaires
        individu.ressources = individu.ressources.concat(_.where(previousRessources, function(ressource) {
            return !!_.find(categoriesRnc, { id: ressource.type }) || _.contains(['pensionsAlimentairesVersees'], ressource.type);
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
