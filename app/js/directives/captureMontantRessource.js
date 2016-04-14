'use strict';

angular.module('ddsApp').directive('montantRessource', function(SituationService) {
    function getOnGoingQuestion (individu, ressource, currentMonth) {
        var subject = {
            'demandeur': 'Vous',
            'conjoint': 'Votre conjoint',
            'enfant': individu.firstName
        }[individu.role],
            verbPrefix = ressource.id == 'pensionsAlimentairesVersees' ? 'verser' : 'percevr',
            verbSufix = individu.role == 'demandeur' ? 'ez' : 'a',
            ressourceLabel = ressource.interuptionQuestionLabel || ressource.prefix + ' ' + ressource.label.slice(0,1).toLowerCase() + ressource.label.slice(1);

        return [subject, verbPrefix + verbSufix, ressourceLabel, 'en', currentMonth].join(' ') + '.';
    }

    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        templateUrl: 'partials/foyer/capture-montant-ressource.html',
        scope: {
            individuVM: '=',
            ressourceType: '=',
            dateDeValeur: '=',
            index: '=',
            form: '=',
        },
        link: function(scope, element, attrs, ngModel) {
            var momentDebutAnnee = moment(scope.dateDeValeur).subtract('years', 1);
            scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
            scope.months = SituationService.getMonths(scope.dateDeValeur);
            scope.currentMonth = moment(scope.dateDeValeur).format('MMMM YYYY');
            scope.isNumber = angular.isNumber;
            scope.onGoingLabel = getOnGoingQuestion(scope.individuVM.individu, scope.ressourceType, scope.currentMonth);

            function checkSumConsistency() {
                scope.monthsSum = scope.ressource.montantsMensuels.reduce(function(sum, current) {
                    return sum + current;
                }, 0);

                ngModel.$setValidity('valuesConsistency', scope.ressource.montantAnnuel >= scope.monthsSum);
            }

            scope.$watch('ressource.montantsMensuels', checkSumConsistency, true);
            scope.$watch('ressource.montantAnnuel', checkSumConsistency);

            ngModel.$render = function() {
                scope.ressource = ngModel.$viewValue;
            };
        }
    };
});
