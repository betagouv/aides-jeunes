'use strict';

angular.module('ddsApp').controller('FoyerRessourceMontantsCtrl', function($scope) {
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

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            $scope.applyIndividuRefsRessourcesToIndividus();
            $scope.$emit('ressources');
        }
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
                        debutPeriode: $scope.momentDebutAnnee.format('YYYY-MM'),
                        finPeriode: $scope.momentFinAnnee.format('YYYY-MM')
                    });
                }
            });
        });
    };
});
