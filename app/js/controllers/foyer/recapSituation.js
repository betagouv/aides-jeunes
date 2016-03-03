'use strict';

angular.module('ddsCommon').controller('RecapSituationCtrl', function($scope, $state, $filter, nationalites, ressourceTypes, logementTypes, locationTypes, categoriesRnc, SituationService, IndividuService) {

    $scope.ressourcesYearMoins2Captured = SituationService.ressourcesYearMoins2Captured($scope.situation);

    var buildRecapLogement = function() {
        var logementLabel = _.find(logementTypes, { id: $scope.situation.logement.type }).label;
        logementLabel = $filter('uppercaseFirst')(logementLabel);
        $scope.recapLogement = '<b>' + logementLabel + '</b>';
        if ('locataire' === $scope.situation.logement.type) {
            $scope.recapLogement += ' d’un logement <b>';
            $scope.recapLogement += _.find(locationTypes, { id: $scope.situation.logement.locationType }).label;
            $scope.recapLogement += '</b>';
            $scope.loyerLabel = 'Loyer';
        } else {
            $scope.loyerLabel = 'Mensualité d’emprunt';
        }
    };

    if ($scope.situation.logement) {
        buildRecapLogement();
    }

    $scope.$on('logementCaptured', function() {
        buildRecapLogement();
    });

    var buildRecapPatrimoine = function() {
        $scope.patrimoine = [];
        [
            {
                id: 'valeurLocativeImmoNonLoue',
                label: 'Valeur locative immobilier non loué'
            },
            {
                id: 'valeurLocativeTerrainNonLoue',
                label: 'Valeur locative terrains non loués'
            },
            {
                id: 'epargneSurLivret',
                label: 'Epargne sur livret'
            },
            {
                id: 'epargneSansRevenus',
                label: 'Epargne sans revenus'
            }
        ].forEach(function(field) {
            if ($scope.situation.patrimoine[field.id]) {
                $scope.patrimoine.push({label: field.label, montant: $scope.situation.patrimoine[field.id]});
            }
        });

        $scope.revenusDuPatrimoine = [];
        [
            {
                id: 'revenusDuCapital',
                label: 'Revenus du capital'
            },
            {
                id: 'revenusLocatifs',
                label: 'Revenus locatifs'
            }
        ].forEach(function(field) {
            var revenus = $scope.situation.patrimoine[field.id];
            if (revenus.length) {
                var value = {label: field.label, values: []};
                $scope.revenusDuPatrimoine.push(value);
                for (var i = 0; i < 3; i++) {
                    var ressource = revenus[i];
                    value.values.push({
                        periode: moment(ressource.periode, 'YYYY-MM').format('MMMM YYYY'),
                        montant: ressource.montant
                    });
                }
                var montants = _.pluck(revenus, 'montant');
                var montantAnnuel = _.reduce(montants, function(sum, montant) {
                    return sum + montant;
                });
                montantAnnuel = Math.round(montantAnnuel);
                value.values.push({
                    periode: 'Année glissante',
                    montant: montantAnnuel
                });
            }
        });
    };

    if ($scope.situation.patrimoine && $scope.situation.patrimoine.captured) {
        buildRecapPatrimoine();
    }

    $scope.$on('patrimoineCaptured', function() {
        buildRecapPatrimoine();
    });

    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);

    $scope.lastMonth = moment($scope.situation.dateDeValeur).subtract('months', 1).startOf('month').format('MMMM YYYY');
    $scope.lastYear = moment($scope.situation.dateDeValeur).subtract('years', 1).format('MMMM YYYY');
    $scope.yearMoinsUn = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract('years', 2).format('YYYY');

    var fillIndividuRessources = function(individu) {
        if (! individu.ressources) {
            return;
        }

        var types = _.chain(individu.ressources)
            .pluck('type')
            .unique();

        types.forEach(function(type) {
            // on ignore les types de ressources autres que ceux déclarés dans ressourceTypes (par ex. les ressources année - 2)
            if (! _.find(ressourceTypes, { id: type })) {
                return;
            }

            var totalMensuel = _.map($scope.months, function(month) {
                var ressource = _.find(individu.ressources, { type: type, periode: month.id });
                return ressource ? ressource.montant : 0;
            });
            var totalAnnuel = _.chain(individu.ressources)
                .where({ type: type })
                .pluck('montant')
                .reduce(function(sum, num) {
                    return sum + num;
                })
                .value();

            var ressourceSection = $scope.tempRessources[type];
            if (! ressourceSection) {
                ressourceSection = $scope.tempRessources[type] = {
                    totalMensuel: totalMensuel,
                    totalAnnuel: totalAnnuel
                };
            } else {
                _.map([0, 1, 2], function(i) {
                    ressourceSection.totalMensuel[i] += totalMensuel[i];
                });
                ressourceSection.totalAnnuel += totalAnnuel;
            }
            $scope.globalAmount += totalAnnuel;
        });
    };

    var buildRecapRessources = function() {
        $scope.tempRessources = {};
        $scope.hasRessources = false;
        $scope.globalAmount = 0;

        $scope.isSituationMonoIndividu = 1 === $scope.situation.individus.length;
        $scope.situation.individus.forEach(fillIndividuRessources);

        if ($scope.globalAmount > 0) {
            $scope.hasRessources = true;
        }

        $scope.ressources = [];
        ressourceTypes.forEach(function(ressourceType) {
            if ($scope.tempRessources[ressourceType.id]) {
                var ressource = {
                    type: ressourceType,
                    totalAnnuel: Math.round($scope.tempRessources[ressourceType.id].totalAnnuel)
                };
                if (! ressourceType.isMontantAnnuel) {
                    ressource.totalMensuel = $scope.tempRessources[ressourceType.id].totalMensuel;
                }
                $scope.ressources.push(ressource);
            }
        });
    };

    if (!! $scope.situation.individus.length && !! $scope.situation.individus[0].ressources) {
        $scope.ressourcesCaptured = true;
        buildRecapRessources();
    }

    $scope.$on('ressourcesUpdated', function() {
        $scope.ressourcesCaptured = true;
        buildRecapRessources();
    });

    var buildRecapRnc = function() {
        $scope.rfrCaptured = $scope.situation.rfr || $scope.situation.rfr === 0;
        $scope.ressourcesYearMoins2 = [];
        var parents = IndividuService.getParents($scope.situation.individus);
        parents.forEach(function(parent) {
            var parentRnc = { label: IndividuService.label(parent), rnc: [] };
            categoriesRnc.forEach(function(rnc) {
                var ressource = _.find(parent.ressources, { type: rnc.id });
                if (ressource) {
                    parentRnc.rnc.push({ label: rnc.label, montant: ressource.montant });
                }
            });
            if (parentRnc.rnc.length) {
                $scope.ressourcesYearMoins2.push(parentRnc);
            }
        });
    };

    if ($scope.ressourcesYearMoins2Captured) {
        buildRecapRnc();
    }
});
