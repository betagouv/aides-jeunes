'use strict';

angular.module('ddsCommon').controller('RecapSituationCtrl', function($scope, $state, $filter, nationalites, ressourceTypes, logementTypes, locationTypes, categoriesRnc, CityService, SituationService, IndividuService, RessourceService) {
    $scope.yearMoins1 = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract('years', 2).format('YYYY');

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
    $scope.keyedRessourceTypes = _.keyBy(ressourceTypes, 'id');

    function getRessources (individu) {
        return ressourceTypes.reduce(function(accum, ressource) {
            if (individu[ressource.id] && _.some(individu[ressource.id])) {
                accum[ressource.id] = individu[ressource.id];
            }
            return accum;
        }, {});
    }

    function prepareRecapRessources() {
        $scope.individusSorted = SituationService.getIndividusSortedParentsFirst($scope.situation);
        $scope.ressourcesByIndividu = $scope.individusSorted.map(getRessources);
        $scope.haveRessourcesDeclared = _.some($scope.ressourcesByIndividu, _.negate(_.isEmpty));
    }

    function buildRecapRessources() {
        $scope.ressourcesCaptured = true;
        prepareRecapRessources();
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
        var rfr = $scope.situation.foyer_fiscal.rfr && $scope.situation.foyer_fiscal.rfr[$scope.yearMoins2];
        $scope.rfrCaptured = rfr || rfr === 0;
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
        $scope.ressourcesYearMoins2Captured = SituationService.ressourcesYearMoins2Captured($scope.situation);
    }
    $scope.ressourcesYearMoins2Captured = SituationService.ressourcesYearMoins2Captured($scope.situation);

    $scope.months = SituationService.getMonths($scope.situation.dateDeValeur);

    $scope.getIndividuRessourcesHeader = IndividuService.ressourceHeader;

    $scope.getRessourceByType = function (typeName) {
        return _.find(ressourceTypes, { id: typeName });
    };

    function getLast12MonthTotal(ressource) {
        return SituationService.getMonths($scope.situation.dateDeValeur, 12).reduce(function(sum, current) {
            return ressource[current.id] ? sum + ressource[current.id] : sum;
        }, 0);
    }

    $scope.getTotalAnnuel = function (ressource) {
        return ressource[$scope.yearMoins1] || ressource[$scope.yearMoins2] || getLast12MonthTotal(ressource);
    };

    $scope.shouldDisplayPersonRessourcesRecap = function (individu) {
        var index = $scope.individusSorted.indexOf(individu);
        return (! _.isEmpty($scope.ressourcesByIndividu[index])) || IndividuService.isParent(individu);
    };

    $scope.getModifyPersonRessourcesLink = function (individu) {
        var index = $scope.individusSorted.indexOf(individu);
        var page = (! _.isEmpty($scope.ressourcesByIndividu[index])) ? 'montants' : 'types';

        return 'foyer.ressources.individu.' + page + '({individu: ' + index + '})';
    };

    if ($scope.situation.logement) {
        buildRecapLogement();
    }

    $scope.$on('logementCaptured', buildRecapLogement);

    prepareRecapRessources();
    $scope.ressourcesCaptured = $scope.haveRessourcesDeclared || Boolean($scope.situation._id);

    $scope.$on('ressourcesUpdated', buildRecapRessources);

    if ($scope.ressourcesYearMoins2Captured) {
        buildYm2Recap();
    }

    $scope.$on('ym2Captured', buildYm2Recap);

    if ($scope.situation.patrimoine && $scope.situation.patrimoine.captured) {
        buildRecapPatrimoine();
    }

    $scope.$on('patrimoineCaptured', buildRecapPatrimoine);

});
