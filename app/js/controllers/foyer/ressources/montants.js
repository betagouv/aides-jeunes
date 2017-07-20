'use strict';

angular.module('ddsApp').controller('FoyerRessourcesMontantsCtrl', function($scope, $stateParams, ressourceTypes, RessourceService, IndividuService) {
    $scope.yearMoins1 = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');
    $scope.currentMonthId = moment($scope.situation.dateDeValeur).format('YYYY-MM');

    $scope.individuLabel = IndividuService.label($scope.individu);

    $scope.ressourceTypes = _.keyBy(ressourceTypes, 'id');
    $scope.isNumber = angular.isNumber;

    $scope.autoEntrepreneurOnGoingQuestion = function(individu, currentMonth) {
        var prefix = {
            'demandeur': 'Vous aurez',
            'conjoint': 'Votre conjoint·e aura',
            'enfant': individu.firstName + ' aura'
        }[individu.role];
        return prefix + ' un chiffre d’affaires non nul en ' + currentMonth + '.';
    };

    _.forEach($scope.selectedRessourceTypes, function(value, key) {
        var ressource = $scope.individu[key];
        if (_.isEmpty($scope.ressource)) {
            if ($scope.ressourceTypes[key].isMontantAnnuel)
            {
                ressource[$scope.yearMoins1] = 0;
            } else {
                $scope.months.forEach(function(month) {
                    ressource[month.id] = 0;
                });
                if (! $scope.ressourceTypes[key].revenuExceptionnel) {
                    ressource[$scope.currentMonthId] = 0;
                }
            }
        }
    });

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            $scope.declareNextIndividuResources(parseInt($stateParams.individu));
        }
    };
});
