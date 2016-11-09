'use strict';

angular.module('ddsCommon').controller('RecapSituationCtrl', function($scope, $state, $filter, nationalites, ressourceTypes, logementTypes, locationTypes, categoriesRnc, SituationService, IndividuService, RessourceService) {

    function buildRecapLogement () {
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
    }

    function getRessources (individu) {
        var filteredRessources = RessourceService.getMainScreenRessources(individu);
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
        $scope.ressourcesCaptured = true;
        $scope.individusSorted = SituationService.getIndividusSortedParentsFirst($scope.situation);
        $scope.ressourcesByIndividu = $scope.individusSorted.map(getRessources);
    }

    function buildRecapPatrimoine () {
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
    }

    function buildYm2Recap () {
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
    }

    $scope.ressourcesYearMoins2Captured = SituationService.ressourcesYearMoins2Captured($scope.situation);
    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);
    $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract('years', 2).format('YYYY');

    $scope.getIndividuRessourcesHeader = IndividuService.ressourceHeader;

    $scope.getRessourceByType = function (typeName) {
        return _.find(ressourceTypes, { id: typeName });
    };

    $scope.getTotalAnnuel = function (ressource) {
        return _.values(ressource).reduce(function (x,y) {
            return x + y;
        });
    };

    $scope.shouldDisplayPersonRessourcesRecap = function (individu) {
        var index = $scope.individusSorted.indexOf(individu);
        return $scope.ressourcesByIndividu[index] || individu.ressources && IndividuService.isParent(individu);
    };

    $scope.getModifyPersonRessourcesLink = function (individu) {
        var index = $scope.individusSorted.indexOf(individu);
        var page = $scope.ressourcesByIndividu[index] ? 'montants' : 'types';

        return 'foyer.ressources.individu.' + page + '({individu: ' + index + '})';
    };

    if ($scope.situation.logement) {
        buildRecapLogement();
    }

    $scope.$on('logementCaptured', buildRecapLogement);

    if ( $scope.situation.individus.length && $scope.situation.individus[0].ressources) {
        buildRecapRessources();
    }

    $scope.$on('ressourcesUpdated', buildRecapRessources);

    if ($scope.ressourcesYearMoins2Captured) {
        buildYm2Recap();
    }

    if ($scope.situation.patrimoine && $scope.situation.patrimoine.captured) {
        buildRecapPatrimoine();
    }

    $scope.$on('patrimoineCaptured', buildRecapPatrimoine);

});
