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
        require: 'ngModel',
        replace: true,
        templateUrl: 'partials/foyer/capture-montant-ressource.html',
        scope: {
            individu: '=',
            ressourceType: '=',
            dateDeValeur: '=',
            index: '=',
            form: '=',
        },
        link: function(scope, element, attrs, ngModel) {
            var momentDebutAnnee = moment(scope.dateDeValeur).subtract('years', 1);
            scope.debutAnneeGlissante = momentDebutAnnee.format('MMMM YYYY');
            scope.months = SituationService.getMonths(scope.dateDeValeur);
            scope.currentMonth = moment(scope.dateDeValeur).format('MMMM YYYY');
            scope.isNumber = angular.isNumber;
            scope.onGoingLabel = getOnGoingQuestion(scope.individu, scope.ressourceType, scope.currentMonth);

            function checkSumConsistency() {
                scope.monthsSum = scope.ressource.montantsMensuels.reduce(function(sum, current) {
                    return sum + current;
                }, 0);

                ngModel.$setValidity('valuesConsistency', scope.ressource.montantAnnuel >= scope.monthsSum);
            }

            scope.$watch('ressource.montantsMensuels', checkSumConsistency, true);
            scope.$watch('ressource.montantAnnuel', checkSumConsistency);

            scope.shouldAskDateArretDeTravail = function() {
                // If there is no IJSS the first month, we know the arret de travail is recent and don't need to capture the date.
                return ['indemnites_journalieres_maladie', 'indemnites_journalieres_maladie_professionnelle', 'indemnites_journalieres_accident_travail'].indexOf(scope.ressourceType.id) >= 0 && scope.ressource.montantsMensuels[0];
            };

            ngModel.$render = function() {
                scope.ressource = ngModel.$viewValue;
            };
        }
    };
});
