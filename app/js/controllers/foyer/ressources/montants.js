'use strict';

angular.module('ddsApp').controller('FoyerRessourcesMontantsCtrl', function($scope, $stateParams, ressourceTypes, RessourceService, IndividuService) {

    $scope.yearMoinsUn = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');
    $scope.individuLabel = IndividuService.label($scope.individu);

    $scope.ressourceTypes = _.indexBy(ressourceTypes, 'id');
    $scope.isNumber = angular.isNumber;

    $scope.autoEntrepreneurOnGoingQuestion = function(individu, currentMonth) {
        var prefix = {
            'demandeur': 'Vous aurez',
            'conjoint': 'Votre conjoint aura',
            'enfant': individu.firstName + ' aura'
        }[individu.role];
        return prefix + ' un chiffre d’affaires non nul en ' + currentMonth + '.';
    };

    $scope.submit = function(form) {
        form.submitted = true;
        if (! form.$valid)
            return document.querySelector('input[aria-invalid="true"]').focus();
        RessourceService.applyRessourcesToIndividu($scope.individu, $scope.ressources, $scope.situation.dateDeValeur);
        $scope.declareNextIndividuResources(parseInt($stateParams.individu));
    };
});
