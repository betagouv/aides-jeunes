'use strict';

angular.module('ddsApp').directive('captureMontantRessource', function(MonthService, RessourceService) {
    function getInitialLabel (individu, ressource, debutAnneeGlissante) {
        var subject = {
            'demandeur': 'Vous',
            'conjoint': 'Votre conjoint·e',
            'enfant': individu.firstName,
        }[individu.role];
        var verbForms = {
            pensions_alimentaires_versees_individu: {
                demandeur: 'versez',
                default: 'verse'
            },
            default: {
                demandeur: 'recevez',
                default: 'reçoit'
            }
        };
        var verbForm = verbForms[ressource.id] || verbForms.default;
        var verb = verbForm[individu.role] || verbForm.default;
        return [subject, verb, 'tous les mois depuis', debutAnneeGlissante].join(' ');
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/partials/simulation/foyer/ressources/capture-montant-ressource.html',
        scope: {
            individu: '=',
            ressourceType: '=',
            dateDeValeur: '=',
            form: '=',
        },
        link: function(scope) {
            var momentDebutAnnee = moment(scope.dateDeValeur).subtract(1, 'years');
            scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
            scope.threePreviousMonths = MonthService.getMonths(scope.dateDeValeur);
            var last12Months = MonthService.getMonths(scope.dateDeValeur, 12);
            var previous9Months = last12Months.slice(0,9);

            var recentMonths = MonthService.getMonths(scope.dateDeValeur, 2, -1);
            var lastMonth = recentMonths[0];
            var currentMonth = recentMonths[1];
            var isoMonths = last12Months;

            scope.regularResourcePrompt = getInitialLabel(scope.individu, scope.ressourceType, scope.debutAnneeGlissante);

            scope.isNumber = angular.isNumber;
            scope.ressource = scope.individu[scope.ressourceType.id];

            if (! scope.ressourceType.revenuExceptionnel) {
                isoMonths = isoMonths.concat(currentMonth);
            }
            
            var lastMonthValue = scope.ressource[lastMonth.id] || 0;

            function determineAnnualValue() {
                return last12Months.reduce(function(sum, month) {
                    return sum + (scope.ressource[month.id] || 0);
                }, 0);
            }

            scope.locals = {
                annualValue: determineAnnualValue(),
                monthlyValue: lastMonthValue,
                detailed: ! isoMonths.reduce(function(previousValuesAreEqual, month) {
                    return previousValuesAreEqual && Math.abs(scope.ressource[month.id] - lastMonthValue) < 1e-3;
                }, true) || scope.ressourceType.revenuExceptionnel
            };

            if (scope.ressourceType.sourceOpenfisca) {
                RessourceService.getParameterFromOpenfisca(scope.ressourceType.sourceOpenfisca)
                    .then(function(parameter) {
                        scope.locals.montantForfaitaire = parameter;
                    });
            }

            function updatePrevious9MonthsValues() {
                var toSpread = ((scope.locals.annualValue || 0) - getRecentSum())/9;
                previous9Months.forEach(function(month) {
                    scope.ressource[month.id] = toSpread;
                });
            }

            function getRecentSum() {
                return _.round(scope.threePreviousMonths.reduce(function(sum, current) {
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

            function dispatchMonthlyValueUpdate() {
                if (scope.locals.detailed)
                    return;
                isoMonths.forEach(function(month) {
                    scope.ressource[month.id] = scope.locals.monthlyValue;
                });
                scope.locals.annualValue = determineAnnualValue();
            }
            scope.$watch('locals.monthlyValue', dispatchMonthlyValueUpdate);

            function setValuesAsCurrentMonth(newDetailedValue, oldDetailedValue) {
                if (oldDetailedValue && ! newDetailedValue) {
                    scope.locals.monthlyValue = scope.ressource[lastMonth.id] || 0;
                    dispatchMonthlyValueUpdate();
                }
            }
            scope.$watch('locals.detailed', setValuesAsCurrentMonth);

            scope.shouldAskDateArretDeTravail = function() {
                // If there is no IJSS the first month, we know the arret de travail is recent and don't need to capture the date.
                return ['indemnites_journalieres_maladie', 'indemnites_journalieres_maladie_professionnelle', 'indemnites_journalieres_accident_travail'].indexOf(scope.ressourceType.id) >= 0 && scope.ressource[scope.threePreviousMonths[0].id];
            };
        }
    };
});
