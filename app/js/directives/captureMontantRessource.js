'use strict';

angular.module('ddsApp').directive('montantRessource', function(SituationService) {
    return {
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        templateUrl: 'partials/foyer/capture-montant-ressource.html',
        scope: {
            shortLabel: '=',
            ressourceType: '=',
            dateDeValeur: '='
        },
        link: function(scope, element, attrs, ngModel) {
            var momentDebutAnnee = moment(scope.dateDeValeur).subtract('years', 1);
            var momentFinAnnee = moment(scope.dateDeValeur).startOf('month').subtract('months', 1);
            scope.debutAnnee = momentDebutAnnee.format('MMMM YYYY');
            scope.finAnnee = momentFinAnnee.format('MMMM YYYY');
            scope.months = SituationService.getMonths(scope.dateDeValeur);
            scope.currentMonth = moment(scope.dateDeValeur).format('MMMM YYYY');

            ngModel.$render = function() {
                scope.ressource = ngModel.$viewValue;
            };

            ngModel.$parsers.push(function(viewValue) {
                return viewValue;
            });

            scope.updateMontantAnnuel = function(ressource) {
                var somme = ressource.montantsMensuels[0] + ressource.montantsMensuels[1] + ressource.montantsMensuels[2];
                if (!_.isNaN(somme)) {
                    ressource.montantAnnuel = Math.round(4 * somme);
                }
            };
        }
    };
});
