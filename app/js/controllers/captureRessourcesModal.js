'use strict';

angular.module('ddsApp').controller('CaptureRessourcesModalCtrl', function($scope, $rootScope, $modalInstance, individus, SituationService, IndividuService, ressourceTypes, ressourcesN2) {
    $scope.isCaptureRessourcesN2 = ressourcesN2;

    var debutAnnee;
    var finAnnee;
    if (ressourcesN2) {
        finAnnee = moment().endOf('year').subtract('years', 2);
        debutAnnee = moment().subtract('years', 2).startOf('year');
    } else {
        finAnnee = moment().startOf('month').subtract('months', 1);
        debutAnnee = moment().subtract('years', 1);
    }

    $scope.debutAnnee = debutAnnee.format('MMMM YYYY');
    $scope.finAnnee = finAnnee.format('MMMM YYYY');
    $scope.yearMoinsUn = moment().subtract('years', 1).format('YYYY');
    $scope.ressourceTypes = ressourceTypes;

    var months = SituationService.getMonths();
    $scope.months = ressourcesN2 ? [] : months;
    $scope.selectedRessourceTypes = {};

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
            selectedRessourceTypes: {},
            ressources: [],
            individu: individu
        };
    });

    $scope.tab = 'ressources';

    var goToTab = function(tab) {
        if ($scope.tab === tab) {
            return;
        }
        if ('montants' === tab) {
            if (1 === $scope.individuRefs.length) {
                $scope.individuRefs[0].selectedRessourceTypes = $scope.selectedRessourceTypes;
            }
            $scope.initIndividusRessources();
        }
        $scope.tab = tab;
    };

    $scope.previousTab = function() {
        if ('montants' === $scope.tab) {
            if (1 === $scope.individuRefs.length) {
                goToTab('ressources');
            } else {
                goToTab('personnes');
            }
        } else {
            goToTab('ressources');
        }
    };

    $scope.submit = function(form) {
        var closeModal = true;
        if ('ressources' === $scope.tab) {
            closeModal = !_.filter($scope.selectedRessourceTypes).length;
            // si le demandeur est seul, on bypass l'écran intermédiaire de sélection des personnes
            if (1 === $scope.individuRefs.length) {
                goToTab('montants');
            } else {
                goToTab('personnes');
            }
        } else if ('personnes' === $scope.tab) {
            goToTab('montants');
            closeModal = !_.filter($scope.individuRefs, 'hasRessources').length;
        } else if ('montants' === $scope.tab) {
            form.submitted = true;
        }

        if (closeModal) {
            if (form.$valid) {
                $scope.applyIndividuRefsRessourcesToIndividus();
                $scope.$emit('ressourcesCaptured', ressourcesN2);
                $modalInstance.close();
            }
        }
    };

    $scope.initIndividusRessources = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            var previousRessources = individuRef.ressources;
            individuRef.ressources = [];
            individuRef.hasRessources = false;
            individuRef.hasRessourcesMicroTns = false;
            individuRef.hasRessourcesOtherTns = false;
            individuRef.hasRessourcesNonTns = false;

            ressourceTypes.forEach(function(ressourceType) {
                if (!individuRef.selectedRessourceTypes[ressourceType.id] || !$scope.selectedRessourceTypes[ressourceType.id]) {
                    return;
                }

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
                    }
                    ressource.montantAnnuel = 0;

                    if (!ressourcesN2 && 'tns' !== ressourceType.category) {
                        ressource.months = [
                            { periode: months[0].id, montant: 0 },
                            { periode: months[1].id, montant: 0 },
                            { periode: months[2].id, montant: 0 }
                        ];
                    }
                }
                individuRef.ressources.push(ressource);
            });
        });
    };

    $scope.montantInvalide = function(montant) {
        return !angular.isNumber(montant);
    };

    $scope.updateMontantAnnuel = function(ressource) {
        var monthsSum = ressource.months[0].montant + ressource.months[1].montant + ressource.months[2].montant;
        ressource.montantAnnuel = Math.round(4 * monthsSum);
    };

    $scope.isRessourceSelected = function(ressourceType) {
        return !!$scope.selectedRessourceTypes[ressourceType.id];
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

                if ('tns' === ressource.type.category) {
                    if ('caMicroEntreprise' === ressource.type.id) {
                        individu.tnsStructureType = ressource.tnsStructureType;
                        individu.tnsActiviteType = ressource.tnsActiviteType;
                        individu.caMicroEntreprise = ressource.montantAnnuel;
                    } else if ('autresRevenusTns' === ressource.type.id) {
                        individu.autresRevenusTns = ressource.montantAnnuel;
                    }
                } else {
                    individu.ressources.push({
                        type: ressource.type.id,
                        montant: ressource.montantAnnuel,
                        debutPeriode: debutAnnee.format('YYYY-MM'),
                        finPeriode: finAnnee.format('YYYY-MM')
                    });
                }
            });
        });
    };
});
