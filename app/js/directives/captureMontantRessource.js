'use strict';

angular.module('ddsApp').directive('captureMontantRessource', function(SituationService) {
    function getOnGoingQuestion (individu, ressource, currentMonth) {
        var subject = {
            'demandeur': 'Vous',
            'conjoint': 'Votre conjoint·e',
            'enfant': individu.firstName
        }[individu.role],
            verbPrefix = ressource.id == 'pensions_alimentaires_versees_individu' ? 'verser' : 'percevr',
            verbSufix = individu.role == 'demandeur' ? 'ez' : 'a',
            ressourceLabel = ressource.interuptionQuestionLabel || ressource.prefix + ' ' + ressource.label.slice(0,1).toLowerCase() + ressource.label.slice(1);

        return [subject, verbPrefix + verbSufix, ressourceLabel, 'en', currentMonth].join(' ') + '.';
    }

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
            scope.months = SituationService.getMonths(scope.dateDeValeur);
            var last12Months = SituationService.getMonths(scope.dateDeValeur, 12);
            var previous9Months = SituationService.getMonths(scope.dateDeValeur, 9, 3);

            scope.currentMonth = moment(scope.dateDeValeur).format('MMMM YYYY');
            scope.currentMonthId = moment(scope.dateDeValeur).format('YYYY-MM');
            scope.isNumber = angular.isNumber;
            scope.ressource = scope.individu[scope.ressourceType.id];
            scope.onGoingLabel = getOnGoingQuestion(scope.individu, scope.ressourceType, scope.currentMonth);

            scope.locals = {
                shouldContinue: angular.isNumber(scope.ressource[scope.currentMonthId]),
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

            function captureContinuationUpdate() {
                if (scope.locals.shouldContinue) {
                    scope.ressource[scope.currentMonthId] = scope.ressource[scope.months[scope.months.length - 1].id];
                } else {
                    delete scope.ressource[scope.currentMonthId];
                }
            }
            scope.$watch('locals.shouldContinue', captureContinuationUpdate);
            // Hack to update current month value when ressource should continue
            scope.$watch('ressource["' + scope.months[scope.months.length - 1].id + '"]', captureContinuationUpdate);

            scope.shouldAskDateArretDeTravail = function() {
                // If there is no IJSS the first month, we know the arret de travail is recent and don't need to capture the date.
                return ['indemnites_journalieres_maladie', 'indemnites_journalieres_maladie_professionnelle', 'indemnites_journalieres_accident_travail'].indexOf(scope.ressourceType.id) >= 0 && scope.ressource[scope.months[0]];
            };
        }
    };
});
