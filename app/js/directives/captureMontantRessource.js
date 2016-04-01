'use strict';

angular.module('ddsApp').directive('montantRessource', function(SituationService) {
    function getFormattedLabel (ressourceLabel) {
        return (/^[aàeéèêëiîïoöôuüy]/i.test(ressourceLabel) ? 'd’' : 'de ') + ressourceLabel.slice(0,1).toLowerCase() + ressourceLabel.slice(1);
    }

    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        templateUrl: 'partials/foyer/capture-montant-ressource.html',
        scope: {
            shortLabel: '=',
            ressourceType: '=',
            dateDeValeur: '=',
            index: '=',
            interruptedLabel: '=?',
            form: '=',
        },
        link: function(scope, element, attrs, ngModel) {
            var momentDebutAnnee = moment(scope.dateDeValeur).subtract('years', 1);
            scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
            scope.months = SituationService.getMonths(scope.dateDeValeur);
            scope.currentMonth = moment(scope.dateDeValeur).format('MMMM YYYY');
            scope.isNumber = angular.isNumber;


            if (! scope.interruptedLabel) {
                scope.interruptedLabel = 'Je ne percevrai plus ' + getFormattedLabel(scope.ressourceType.label) + ' en ' + scope.currentMonth;
            }

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
