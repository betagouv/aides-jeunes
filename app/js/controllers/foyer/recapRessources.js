'use strict';

angular.module('ddsApp').controller('FoyerRecapRessourcesCtrl', function($scope, $rootScope, ressourceTypes, SituationService, IndividuService) {
    $scope.months = SituationService.getMonths();
    $scope.individuLabel = IndividuService.label;

    $scope.lastMonth = moment().subtract('months', 1).startOf('month').format('MMMM YYYY');
    $scope.lastYear = moment().subtract('years', 1).format('MMMM YYYY');
    $scope.yearMoinsUn = moment().subtract('years', 1).format('YYYY');

    var initRessources = function() {
        $scope.tempRessources = {};
        $scope.hasRessources = false;
        $scope.hasRessourcesTns = false;
        $scope.hasRessourcesNonTns = false;
        $scope.globalAmount = 0;

        var individus = SituationService.createIndividusList($scope.situation);
        $scope.isSituationMonoIndividu = 1 === individus.length;
        individus.map($scope.fillIndividuRessources);

        if ($scope.globalAmount > 0) {
            $scope.hasRessources = true;
        }

        $scope.ressourcesMicroFiscal = [];
        $scope.ressourcesAutresTns = [];
        $scope.ressourcesNonTns = [];
        ressourceTypes.forEach(function(ressourceType) {
            if ($scope.tempRessources[ressourceType.id]) {
                if ('caMicroEntreprise' === ressourceType.id) {
                    $scope.ressourcesMicroFiscal.push({
                        type: ressourceType,
                        totalAnnuel: $scope.tempRessources[ressourceType.id].totalAnnuel,
                        byIndividu: $scope.tempRessources[ressourceType.id].byIndividu
                    });
                } else if ('autresRevenusTns' === ressourceType.id) {
                    $scope.ressourcesAutresTns.push({
                        type: ressourceType,
                        totalAnnuel: $scope.tempRessources[ressourceType.id].totalAnnuel,
                        byIndividu: $scope.tempRessources[ressourceType.id].byIndividu
                    });
                } else {
                    $scope.ressourcesNonTns.push({
                        type: ressourceType,
                        total: $scope.tempRessources[ressourceType.id].total,
                        totalAnnuel: $scope.tempRessources[ressourceType.id].totalAnnuel,
                        byIndividu: $scope.tempRessources[ressourceType.id].byIndividu
                    });
                }
            }
        });
    };

    $scope.fillIndividuRessources = function(individu) {
        var monthsIndexes = {};
        monthsIndexes[$scope.months[0].id] = 0;
        monthsIndexes[$scope.months[1].id] = 1;
        monthsIndexes[$scope.months[2].id] = 2;

        individu.ressources.forEach(function(ressource) {
            var ressourceSection = $scope.tempRessources[ressource.type];
            if (!ressourceSection) {
                ressourceSection = $scope.tempRessources[ressource.type] = {
                    total: [0, 0, 0],
                    byIndividu: [],
                    totalAnnuel: 0
                };
            }

            var individuRessource = _.find($scope.tempRessources[ressource.type].byIndividu, { label: IndividuService.label(individu) });
            if (!individuRessource) {
                individuRessource = {
                    label: IndividuService.label(individu),
                    values: []
                };
                $scope.tempRessources[ressource.type].byIndividu.push(individuRessource);
            }

            if (ressource.debutPeriode) {
                individuRessource.montantAnnuel = ressource.montant;
                $scope.tempRessources[ressource.type].totalAnnuel += ressource.montant;
            } else {
                var monthIndex = monthsIndexes[ressource.periode];
                individuRessource.values[monthIndex] = ressource.montant;
                $scope.tempRessources[ressource.type].total[monthIndex] += ressource.montant;
            }
            $scope.globalAmount += ressource.montant;
        });
    };

    if ($scope.situation.ressourcesCaptured) {
        initRessources();
    }

    $rootScope.$on('ressourcesCaptured', function() {
        $scope.situation.ressourcesCaptured = true;
        initRessources();
    });
});
