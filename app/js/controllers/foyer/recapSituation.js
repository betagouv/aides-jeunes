'use strict';

angular.module('ddsCommon').controller('RecapSituationCtrl', function($scope, $state, $filter, nationalites, ressourceTypes, logementTypes, locationTypes, categoriesRnc, SituationService, IndividuService) {

    $scope.getIndividuRessourcesHeader = IndividuService.ressourceHeader;

    $scope.ressourcesYearMoins2Captured = SituationService.ressourcesYearMoins2Captured($scope.situation);

    $scope.isParent = IndividuService.isParent;

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

    $scope.getRessourceType = function (typeName) {
        return _.find(ressourceTypes, { id: typeName });
    };

    $scope.getTotalAnnuel = function (ressource) {
        return Math.round(
            _.values(ressource).reduce(function (x,y) {
                return x + y;
            }));
    };

    function getRessources (individu) {
        var filteredRessources = individu.ressources && individu.ressources.filter(function(ressource) {
            return ressource.type.indexOf('rnc') < 0;
        });
        if (_.isEmpty(filteredRessources)) {
            return;
        }
        var ressourcesByType = _.groupBy(filteredRessources, 'type');
        return _.mapValues(ressourcesByType, function(ressources) {
            return _.mapValues(_.groupBy(ressources, 'periode'), function(ressource) {
                return ressource[0].montant;
            });
        });
    }

    function buildRecapRessources () {
        $scope.hasRessources = $scope.situation.individus.some(function(individu) {
            return individu.ressources.length;
        });
        $scope.individusSorted = SituationService.getIndividusSortedParentsFirst($scope.situation);
        $scope.ressourcesByIndividu = $scope.individusSorted.map(getRessources);
    }

    if ( $scope.situation.individus.length && $scope.situation.individus[0].ressources) {
        $scope.ressourcesCaptured = true;
        buildRecapRessources();
    }

    $scope.$on('ressourcesUpdated', function() {
        $scope.ressourcesCaptured = true;
        buildRecapRessources();
    });

    var buildYm2Recap = function() {
        $scope.rfrCaptured = $scope.situation.rfr || $scope.situation.rfr === 0;
        $scope.ressourcesYearMoins2 = [];
        SituationService.getIndividusSortedParentsFirst($scope.situation)
        .forEach(function(individu) {
            var ym2IndividuRecap = { label: IndividuService.label(individu), ressources: [] };
            categoriesRnc.forEach(function(rnc) {
                var ressource = _.find(individu.ressources, { type: rnc.id });
                if (ressource) {
                    ym2IndividuRecap.ressources.push({ label: rnc.label, montant: ressource.montant });
                }
            });
            if (ym2IndividuRecap.ressources.length) {
                $scope.ressourcesYearMoins2.push(ym2IndividuRecap);
            }
        });
    };

    if ($scope.ressourcesYearMoins2Captured) {
        buildYm2Recap();
    }
});
