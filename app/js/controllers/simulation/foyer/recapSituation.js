'use strict';

angular.module('ddsCommon').controller('RecapSituationCtrl', function($scope, $state, ressourceTypes, patrimoineTypes, categoriesRnc, CityService, SituationService, IndividuService, LogementService, MonthService, RessourceService) {
    $scope.keyedRessourceTypes = _.keyBy(ressourceTypes, 'id');
    $scope.categoriesRnc = categoriesRnc;
    $scope.getIndividuRessourcesHeader = IndividuService.ressourceShortLabel;

    $scope.locals = {
        show: true,
    };

    function buildRecapLogement () {
        var logementLabels = LogementService.getLabels($scope.situation.menage.statut_occupation_logement);

        $scope.loyerLabel = logementLabels.loyerLabel;
        $scope.recapLogement = logementLabels.recapLogement;
    }

    function getRessources (individu) {
        return _
            .keys($scope.keyedRessourceTypes)
            .filter(function(ressourceId) {
                return RessourceService.isSelectedForCurrentYear(individu[ressourceId], ressourceId);
            })
            .reduce(function(accum, ressourceId) {
                accum[ressourceId] = individu[ressourceId];
                return accum;
            }, {});
    }

    function buildRecapRessources() {
        $scope.individusSorted = SituationService.getIndividusSortedParentsFirst($scope.situation);
        $scope.ressourcesByIndividu = $scope.individusSorted.map(getRessources);
        $scope.haveRessourcesDeclared = _.some($scope.ressourcesByIndividu, _.negate(_.isEmpty));
    }

    function buildRecapPatrimoine () {
        var hasPatrimoine = SituationService.hasPatrimoine($scope.situation);
        $scope.patrimoine = [];
        $scope.patrimoine.captured = angular.isDefined(hasPatrimoine);
        if (! $scope.patrimoine.captured || ! hasPatrimoine)
            return;

        var demandeur = $scope.situation.individus[0];
        patrimoineTypes.forEach(function(field) {
            var value = demandeur[field.id] && _.values(demandeur[field.id])[0];
            if (value) {
                $scope.patrimoine.push({ label: field.label, montant: value });
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
                    var ressource = individu[rnc.id];
                    if ((! ressource) || (! ressource[$scope.yearMoins2])) {
                        return;
                    }
                    ym2IndividuRecap.ressources.push({ label: rnc.label, montant: ressource[$scope.yearMoins2] });
                });
                if (ym2IndividuRecap.ressources.length) {
                    $scope.ressourcesYearMoins2.push(ym2IndividuRecap);
                }
            });
        $scope.ressourcesYearMoins2Captured = SituationService.ressourcesYearMoins2Captured($scope.situation);
    }

    $scope.getRessourceByType = function (typeName) {
        return _.find(ressourceTypes, { id: typeName });
    };

    function getLast12MonthTotal(ressource) {
        return MonthService.getMonths($scope.situation.dateDeValeur, 12).reduce(function(sum, current) {
            return ressource[current.id] ? sum + ressource[current.id] : sum;
        }, 0);
    }

    $scope.getTotalAnnuel = function (ressource) {
        return ressource[$scope.yearMoins1] || getLast12MonthTotal(ressource);
    };

    $scope.shouldDisplayPersonRessourcesRecap = function (individu) {
        var index = $scope.individusSorted.indexOf(individu);
        return ($scope.situation._id || angular.isDefined(individu.hasRessources)) &&
            ((! _.isEmpty($scope.ressourcesByIndividu[index]) || IndividuService.isParent(individu)));
    };

    $scope.getModifyPersonRessourcesLink = function (individu) {
        var index = $scope.individusSorted.indexOf(individu);
        var page = (! _.isEmpty($scope.ressourcesByIndividu[index])) ? 'montants' : 'types';

        return 'foyer.ressources.individu.' + page + '({individu: ' + index + '})';
    };

    $scope.$on('logementCaptured', buildRecapLogement);
    $scope.$on('ressourcesUpdated', buildRecapRessources);
    $scope.$on('ym2Captured', buildYm2Recap);
    $scope.$on('patrimoineCaptured', buildRecapPatrimoine);

    function refreshFullView() {

        $scope.yearMoins1 = moment($scope.situation.dateDeValeur).subtract(1, 'years').format('YYYY');
        $scope.yearMoins2 = moment($scope.situation.dateDeValeur).subtract(2, 'years').format('YYYY');
        $scope.ressourcesYearMoins2Captured = SituationService.ressourcesYearMoins2Captured($scope.situation);
        $scope.months = MonthService.getMonths($scope.situation.dateDeValeur);

        if ($scope.situation.menage && $scope.situation.menage.statut_occupation_logement) {
            buildRecapLogement();
        }
        buildRecapRessources();
        if ($scope.ressourcesYearMoins2Captured) {
            buildYm2Recap();
        }
        buildRecapPatrimoine();

    }

    $scope.$on('newSituation', refreshFullView);
    refreshFullView();
});
