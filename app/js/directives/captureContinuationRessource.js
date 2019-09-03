'use strict';

angular.module('ddsApp').directive('captureContinuation', function(MonthService) {
    function getOnGoingQuestion (individu, ressource, currentMonth) {
        var subject = {
            'demandeur': 'Vous',
            'conjoint': 'Votre conjoint·e',
            'enfant': individu.firstName,
        }[individu.role];
        var verbPrefixes = {
            'pensions_alimentaires_versees_individu': 'verser',
            'tns_auto_entrepreneur_chiffre_affaires': 'aur',
            'default': 'percevr',
        };
        var verbPrefix = verbPrefixes[ressource.id] || verbPrefixes.default;
        var verbSufix = individu.role == 'demandeur' ? 'ez' : 'a';
        var ressourceLabel = ressource.interuptionQuestionLabel || ressource.prefix + ' ' + ressource.label.slice(0,1).toLowerCase() + ressource.label.slice(1);

        return [subject, verbPrefix + verbSufix, ressourceLabel, 'en', currentMonth].join(' ') + '.';
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/partials/simulation/foyer/ressources/capture-continuation-ressource.html',
        scope: {
            dateDeValeur: '=',
            individu: '=',
            ressourceType: '=',
        },
        link: function(scope) {
            var months = MonthService.getMonths(scope.dateDeValeur, 2, -1);
            var lastMonth = months[0];
            var currentMonth = months[1];
            var ressource = scope.ressource = scope.individu[scope.ressourceType.id];
            scope.onGoingLabel = getOnGoingQuestion(scope.individu, scope.ressourceType, currentMonth.label);

            scope.locals = {
                shouldContinue: angular.isNumber(ressource[currentMonth.id]),
            };

            function captureContinuationUpdate() {
                if (scope.locals.shouldContinue) {
                    ressource[currentMonth.id] = ressource[lastMonth.id];
                } else {
                    delete ressource[currentMonth.id];
                }
            }
            scope.$watch('locals.shouldContinue', captureContinuationUpdate);
            // Hack to update current month value when ressource should continue
            scope.$watch('ressource["' + lastMonth.id + '"]', captureContinuationUpdate);
        }
    };
});
