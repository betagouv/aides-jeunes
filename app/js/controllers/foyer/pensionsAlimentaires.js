'use strict';

angular.module('ddsApp').controller('FoyerPensionsAlimentairesCtrl', function($scope, ressourceTypes, SituationService, IndividuService, RessourceService) {
    var momentDebutAnnee = moment($scope.situation.dateDeValeur).subtract('years', 1);
    $scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');
    var months = SituationService.getMonths($scope.situation.dateDeValeur);

    var initMontantsMensuels = function(individu, pensionType) {
        var result = _.map(months, function(month) {
            var ressource = _.find(individu.ressources, { periode: month.id, type: pensionType });
            return ressource ? Math.round(ressource.montant) : 0;
        });

        return result;
    };

    var initMontantAnnuel = function(individu, pensionType) {
        var result = _.chain(individu.ressources)
            .where({ type: pensionType })
            .pluck('montant')
            .reduce(function(sum, num) {
                return sum + num;
            })
            .value();

        return Math.round(result) || 0;
    };

    $scope.pensionsVersees = _.find(ressourceTypes, { id: 'pensionsAlimentairesVersees' });

    function createIndividuVM (individu) {
        return {
            individu: individu,
            label: IndividuService.label(individu),
            pensionsVersees: {
                type: $scope.pensionsVersees,
                montantsMensuels: initMontantsMensuels(individu, 'pensionsAlimentairesVersees'),
                montantAnnuel: initMontantAnnuel(individu, 'pensionsAlimentairesVersees'),
                onGoing: true
            }
        };
    };

    var demandeur = _.find($scope.situation.individus, { role: 'demandeur' });
    var conjoint = _.find($scope.situation.individus, { role: 'conjoint' });
    $scope.individusVM = [createIndividuVM(demandeur)];
    if (conjoint) {
        $scope.individusVM.push(createIndividuVM(conjoint));
    }

    $scope.situation.hasPensionsAlimentaires = false;
    $scope.individusVM.forEach(function(individuVM) {
        if (_.any([
            _.find(individuVM.individu.ressources, { type: 'pensionsAlimentairesVersees' })
        ])) {
            $scope.situation.hasPensionsAlimentaires = true;
        }
    });

    function applyPensionToIndividu (individuVM) {
        var individu = individuVM.individu;
        var ressource = individuVM.pensionsVersees;
        RessourceService.spreadIndividuRessources(individu, months, ressource, $scope.situation.dateDeValeur);
    };

    $scope.submit = function() {
        $scope.individusVM.forEach(function (individuVM) {
            // Remove old pensions alimentaires versees
            individuVM.individu.ressources = _.filter(individuVM.individu.ressources, function(ressource) {
                return ! _.contains(['pensionsAlimentairesVersees'], ressource.type);
            });
            if ($scope.situation.hasPensionsAlimentaires) {
                applyPensionToIndividu(individuVM);
            }
        });

        $scope.$emit('pensionsAlimentaires');
    };
});
