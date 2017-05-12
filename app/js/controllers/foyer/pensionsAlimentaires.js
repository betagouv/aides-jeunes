'use strict';

angular.module('ddsApp').controller('FoyerPensionsAlimentairesCtrl', function($scope, ressourceTypes, SituationService, IndividuService, RessourceService) {

    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');
    var months = SituationService.getMonths($scope.situation.dateDeValeur);

    var initMontantsMensuels = function(individu, pensionType) {
        var result = _.map(months, function(month) {
            var ressource = _.find(individu.ressources, { periode: month.id, type: pensionType });
            return ressource ? RessourceService.roundToCents(ressource.montant) : 0;
        });

        return result;
    };

    var initMontantAnnuel = function(individu, pensionType) {
        var result = _.chain(individu.ressources)
            .filter({ type: pensionType })
            .map('montant')
            .reduce(function(sum, num) {
                return sum + num;
            })
            .value();

        return RessourceService.roundToCents(result) || 0;
    };

    $scope.pensionsVersees = _.find(ressourceTypes, { id: 'pensions_alimentaires_versees_individu' });

    function createIndividuVM (individu) {
        return {
            individu: individu,
            label: IndividuService.label(individu),
            pensionsVersees: {
                type: $scope.pensionsVersees,
                montantsMensuels: initMontantsMensuels(individu, 'pensions_alimentaires_versees_individu'),
                montantAnnuel: initMontantAnnuel(individu, 'pensions_alimentaires_versees_individu'),
                onGoing: true
            }
        };
    }

    var demandeur = _.find($scope.situation.individus, { role: 'demandeur' });
    var conjoint = _.find($scope.situation.individus, { role: 'conjoint' });
    $scope.individusVM = [createIndividuVM(demandeur)];
    if (conjoint) {
        $scope.individusVM.push(createIndividuVM(conjoint));
    }

    $scope.situation.parentsPayPensionsAlimentaires = false;
    $scope.individusVM.forEach(function(individuVM) {
        if (_.some([
            _.find(individuVM.individu.ressources, { type: 'pensions_alimentaires_versees_individu' })
        ])) {
            $scope.situation.parentsPayPensionsAlimentaires = true;
        }
    });

    function applyPensionToIndividu (individuVM) {
        var individu = individuVM.individu;
        var ressource = individuVM.pensionsVersees;
        RessourceService.spreadIndividuRessources(individu, months, ressource, $scope.situation.dateDeValeur);
    }

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            $scope.individusVM.forEach(function (individuVM) {
                // Remove old pensions alimentaires versees
                individuVM.individu.ressources = _.filter(individuVM.individu.ressources, function(ressource) {
                    return ! _.includes(['pensions_alimentaires_versees_individu'], ressource.type);
                });
                if ($scope.situation.parentsPayPensionsAlimentaires) {
                    applyPensionToIndividu(individuVM);
                }
            });
            $scope.$emit('pensionsAlimentaires');
        }
    };
});
