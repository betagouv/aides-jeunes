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

        return result || 0;
    };

    $scope.pensionsVersees = _.find(ressourceTypes, { id: 'pensionsAlimentairesVersees' });

    var createIndividuVM = function(individu) {
        var result = {
            individu: individu,
            label: IndividuService.label(individu),
            pensionsVersees: {
                type: $scope.pensionsVersees,
                montantsMensuels: initMontantsMensuels(individu, 'pensionsAlimentairesVersees'),
                montantAnnuel: initMontantAnnuel(individu, 'pensionsAlimentairesVersees'),
                onGoing: true
            }
        };

        return result;
    };

    var demandeur = _.find($scope.situation.individus, { role: 'demandeur' });
    var conjoint = _.find($scope.situation.individus, { role: 'conjoint' });
    $scope.individusVM = [createIndividuVM(demandeur)];
    if (conjoint) {
        $scope.individusVM.push(createIndividuVM(conjoint));
    }

    $scope.hasPensionsAlimentaires = false;
    $scope.individusVM.forEach(function(individuVM) {
        if (_.any([
            _.find(individuVM.individu.ressources, { type: 'pensionsAlimentairesVersees' })
        ])) {
            $scope.hasPensionsAlimentaires = true;
        }
    });

    var applyPensionToIndividu = function(individuVM, typePension) {
        var individu = individuVM.individu;
        var ressource = individuVM[typePension];
        RessourceService.spreadIndividuRessources(individu, months, ressource, $scope.situation.dateDeValeur);
    };

    $scope.submit = function() {
        $scope.individusVM.forEach(function(individuVM) {
            if ($scope.hasPensionsAlimentaires) {
                ['pensionsVersees'].forEach(function(typePension) {
                    applyPensionToIndividu(individuVM, typePension);
                });
            } else {
                individuVM.individu.ressources = _.filter(individuVM.individu.ressources, function(ressource) {
                    return ! _.contains(['pensionsAlimentairesVersees'], ressource.type);
                });
            }
        });

        $scope.$emit('pensionsAlimentaires');
    };
});
