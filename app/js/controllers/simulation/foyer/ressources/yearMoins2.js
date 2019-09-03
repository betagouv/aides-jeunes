'use strict';

angular.module('ddsApp').controller('FoyerRessourceYearMoins2Ctrl', function($scope, $state, categoriesRnc, IndividuService, SituationService, MonthService) {
    var dateDeValeur = $scope.situation.dateDeValeur;
    var months = MonthService.getMonths(dateDeValeur, 12);
    $scope.yearMoins2 = moment(dateDeValeur).subtract(2, 'years').format('YYYY');
    $scope.yearMoins1 = moment(dateDeValeur).subtract(1, 'years').format('YYYY');
    $scope.debutAnneeGlissante = moment(dateDeValeur).subtract(1, 'years').format('MMMM YYYY');

    $scope.individuRefsToDisplay = [];
    $scope.individuRefsToHide = [];
    SituationService.getIndividusSortedParentsFirst($scope.situation).forEach(function(individu) {
        var individuRef = {
            individu: individu,
            label: IndividuService.label(individu),
            rnc : categoriesRnc,
        };

        categoriesRnc.forEach(function(categorieRnc) {
            individu[categorieRnc.id] = individu[categorieRnc.id] || {};
        });

        var hasYM2Ressources = categoriesRnc.reduce(function(hasYM2RessourcesAccum, categorieRnc) {
            return hasYM2RessourcesAccum || typeof individu[categorieRnc.id][$scope.yearMoins2] == 'number';
        }, false);

        var display = IndividuService.isParent(individu) || hasYM2Ressources;
        (display ? $scope.individuRefsToDisplay : $scope.individuRefsToHide).push(individuRef);
    });

    $scope.display = function(individuRef) {
        $scope.individuRefsToDisplay.push(individuRef);
        $scope.individuRefsToHide = _.without($scope.individuRefsToHide, individuRef);
    };

    $scope.getDefaultValue = function(individuRef, rnc) {
        return _.sum((rnc.sources || []).map(function(sourceName) {
            if (! individuRef.individu[sourceName]) {
                return 0;
            }

            var ressource = individuRef.individu[sourceName];
            return months.reduce(function(sum, month) {
                if (! ressource[month.id]) {
                    return sum;
                }

                return sum + ressource[month.id];
            }, 0);
        }));
    };

    $scope.submit = function(form) {
        if (form && (! form.$valid))
            return;

        $scope.$emit('rnc');
    };
});
