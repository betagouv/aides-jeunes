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
            dateDeValeur: '=',
            index: '=',
            onGoingLabel: '=?'
        },
        link: function(scope, element, attrs, ngModel) {
            var momentDebutAnnee = moment(scope.dateDeValeur).subtract('years', 1);
            scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
            scope.months = SituationService.getMonths(scope.dateDeValeur);
            scope.currentMonth = moment(scope.dateDeValeur).format('MMMM YYYY');

            if (!scope.onGoingLabel) {
                scope.onGoingLabel = 'Je continuerai à percevoir cette ressource en ' + scope.currentMonth;
            }

            ngModel.$render = function() {
                scope.ressource = ngModel.$viewValue;
            };
        }
    };
});
