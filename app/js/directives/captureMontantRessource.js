'use strict';

angular.module('ddsApp').directive('captureMontantRessource', function(MonthService) {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/foyer/capture-montant-ressource.html',
        scope: {
            individu: '=',
            ressourceType: '=',
            dateDeValeur: '=',
            form: '=',
        },
        link: function(scope, element, attrs) {
            var momentDebutAnnee = moment(scope.dateDeValeur).subtract('years', 1);
            scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
            scope.months = MonthService.getMonths(scope.dateDeValeur);
            var last12Months = MonthService.getMonths(scope.dateDeValeur, 12);
            var previous9Months = last12Months.slice(0,9);

            scope.isNumber = angular.isNumber;
            scope.ressource = scope.individu[scope.ressourceType.id];

            scope.locals = {
                annualValue: last12Months.reduce(function(sum, month) {
                    return sum + (scope.ressource[month.id] ? scope.ressource[month.id] : 0);
                }, 0),
            };

            function updatePrevious9MonthsValues() {
                var toSpread = ((scope.locals.annualValue || 0) - getRecentSum())/9;
                previous9Months.forEach(function(month) {
                    scope.ressource[month.id] = toSpread;
                });
            }

            function getRecentSum() {
                return _.round(scope.months.reduce(function(sum, current) {
                    return sum + (scope.ressource[current.id] || 0);
                }, 0), 2);
            }
            scope.monthsSum = getRecentSum();

            function checkSumConsistency() {
                scope.monthsSum = getRecentSum();
                updatePrevious9MonthsValues();

                scope.form.$setValidity('valuesConsistency', scope.locals.annualValue >= scope.monthsSum);
            }
            scope.$watch('locals.annualValue', checkSumConsistency);
            scope.$watchCollection('ressource', checkSumConsistency);

            scope.shouldAskDateArretDeTravail = function() {
                // If there is no IJSS the first month, we know the arret de travail is recent and don't need to capture the date.
                return ['indemnites_journalieres_maladie', 'indemnites_journalieres_maladie_professionnelle', 'indemnites_journalieres_accident_travail'].indexOf(scope.ressourceType.id) >= 0 && scope.ressource[scope.months[0]];
            };
        }
    };
});
