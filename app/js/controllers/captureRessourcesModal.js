'use strict';

angular.module('ddsApp').controller('CaptureRessourcesModalCtrl', function($scope, $rootScope, $modalInstance, individus, SituationService, IndividuService, ressourceTypes, ressourcesN2) {
    $scope.isCaptureRessourcesN2 = ressourcesN2;

    var debutPeriode;
    var finPeriode;
    if (ressourcesN2) {
        finPeriode = moment().endOf('year').subtract('years', 2);
        debutPeriode = moment().subtract('years', 2).startOf('year');
    } else {
        finPeriode = moment().startOf('month').subtract('months', 1);
        debutPeriode = moment().subtract('years', 1);
    }

    $scope.debutPeriode = debutPeriode.format('MMMM YYYY');
    $scope.finPeriode = finPeriode.format('MMMM YYYY');
    $scope.yearMoinsUn = moment().subtract('years', 1).format('YYYY');
    $scope.ressourceTypes = ressourceTypes;

    var months = SituationService.getMonths();
    $scope.months = ressourcesN2 ? [] : months;
    $scope.selectedRessources = {};

    $scope.isRessourceTypeNonTns = function(ressource) {
        return 'tns' !== ressource.category;
    };

    $scope.isRessourceTypeMicroTns = function(ressource) {
        return 'tns' === ressource.category && 'autresRevenusTns' !== ressource.id;
    };

    $scope.isRessourceNonTns = function(ressource) {
        return $scope.isRessourceTypeNonTns(ressource.type);
    };

    $scope.isRessourceMicroTns = function(ressource) {
        return $scope.isRessourceTypeMicroTns(ressource.type);
    };

    $scope.isRessourceOtherTns = function(ressource) {
        return 'autresRevenusTns' === ressource.type.id;
    };

    $scope.individuRefs = _.map(individus, function(individu) {
        return {
            label: IndividuService.label(individu),
            selectedRessources: {},
            ressources: [],
            individu: individu
        };
    });

    $scope.tab = 'ressources';

    $scope.goToTab = function(tab) {
        if ($scope.tab === tab) {
            return;
        }
        if ('ressources' !== tab && !$scope.hasSelectedRessources()) {
            return;
        }
        if ('montants' === tab) {
            if (!$scope.isTabMontantAllowed()) {
                return;
            }
            if (1 === $scope.individuRefs.length) {
                $scope.individuRefs[0].selectedRessources = $scope.selectedRessources;
            }
            $scope.initIndividusRessources();
        }
        $scope.tab = tab;
    };

    $scope.isTabMontantAllowed = function() {
        if (1 === $scope.individuRefs.length) {
            return $scope.hasSelectedRessources();
        } else {
            return $scope.hasRessources();
        }
    };

    $scope.previousTab = function() {
        if ('montants' === $scope.tab) {
            if (1 === $scope.individuRefs.length) {
                $scope.goToTab('ressources');
            } else {
                $scope.goToTab('personnes');
            }
        } else {
            $scope.goToTab('ressources');
        }
    };

    $scope.hasSelectedRessources = function() {
        return !!_.filter($scope.selectedRessources).length;
    };

    $scope.nextTab = function() {
        var closeModal = true;
        if ('ressources' === $scope.tab) {
            closeModal = !$scope.hasSelectedRessources();
            // cas particulier si le demandeur est seul : on bypass l'écran intermédiaire de sélection des personnes
            if (1 < $scope.individuRefs.length) {
                $scope.goToTab('personnes');
            } else {
                $scope.goToTab('montants');
            }
        } else if ('personnes' === $scope.tab) {
            $scope.goToTab('montants');
            closeModal = !$scope.hasRessources();
        }

        if (closeModal) {
            $scope.applyIndividuRefsRessourcesToIndividus();
            $rootScope.$broadcast('ressourcesCaptured', ressourcesN2);
            $modalInstance.close();
        }
    };

    $scope.hasRessources = function() {
        return 0 < _.filter($scope.individuRefs, 'hasRessources').length;
    };

    $scope.initIndividusRessources = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            _.forEach(individuRef.selectedRessources, function(selected, type) {
                if (!$scope.selectedRessources[type]) {
                    individuRef.selectedRessources[type] = false;
                }
            });

            individuRef.ressources = _.filter(individuRef.ressources, function(ressource) {
                return !!individuRef.selectedRessources[ressource.type.id];
            });

            var previousRessources = individuRef.ressources;
            individuRef.ressources = [];
            individuRef.hasRessources = false;
            individuRef.hasRessourcesMicroTns = false;
            individuRef.hasRessourcesOtherTns = false;
            individuRef.hasRessourcesNonTns = false;
            $scope.ressourceTypes.forEach(function(ressourceType) {
                if (individuRef.selectedRessources[ressourceType.id]) {
                    individuRef.hasRessources = true;
                    if ('caMicroEntreprise' === ressourceType.id) {
                        individuRef.hasRessourcesMicroTns = true;
                    } else if ('autresRevenusTns' === ressourceType.id) {
                        individuRef.hasRessourcesOtherTns = true;
                    } else {
                        individuRef.hasRessourcesNonTns = true;
                    }

                    var ressource = _.find(previousRessources, {type: ressourceType});
                    if (!ressource) {
                        ressource = {type: ressourceType};
                        if ('caMicroEntreprise' === ressourceType.id) {
                            ressource.tnsStructureType = 'auto_entrepreneur';
                            ressource.tnsActiviteType = 'bic';
                            ressource.chiffreAffaires = 0;
                        } else if ('autresRevenusTns' === ressourceType.id) {
                            ressource.chiffreAffaires = 0;
                        } else {
                            ressource.year = {montant: 0};
                        }

                        if (!ressourcesN2 && 'tns' !== ressourceType) {
                            ressource.months = [
                                { periode: months[0].id, montant: 0 },
                                { periode: months[1].id, montant: 0 },
                                { periode: months[2].id, montant: 0 }
                            ];
                        }
                    }
                    individuRef.ressources.push(ressource);
                }
            });
        });
    };

    $scope.updateYearAmount = function(ressource) {
        var montants = _.map(ressource.months, function(month) {
            return month.montant;
        });
        ressource.year.montant = Math.round(4 * _.reduce(montants, function(sum, num) {
            return sum + num;
        }));
    };

    $scope.isRessourceSelected = function(ressourceType) {
        return !!$scope.selectedRessources[ressourceType.id];
    };

    $scope.applyIndividuRefsRessourcesToIndividus = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            var individu = individuRef.individu;
            individu.ressources = [];
            individuRef.ressources.forEach(function(ressource) {
                if (ressource.months) {
                    ressource.months.forEach(function(month) {
                        individu.ressources.push({
                            periode: month.periode,
                            type: ressource.type.id,
                            montant: month.montant
                        });
                    });
                }

                var ressourceToPush = {
                    debutPeriode: debutPeriode.format('YYYY-MM'),
                    finPeriode: finPeriode.format('YYYY-MM'),
                    type: ressource.type.id
                };
                if ('tns' === ressource.type.category) {
                    ressourceToPush.montant = ressource.chiffreAffaires;
                } else {
                    ressourceToPush.montant = ressource.year.montant;
                }
                individu.ressources.push(ressourceToPush);
            });
        });
    };
});
