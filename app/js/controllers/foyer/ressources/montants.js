'use strict';

angular.module('ddsApp').controller('FoyerRessourcesMontantsCtrl', function($scope, $stateParams, ressourceTypes, RessourceService, IndividuService) {
    $scope.yearMoins1 = moment($scope.situation.dateDeValeur).subtract('years', 1).format('YYYY');
    $scope.currentMonth = moment($scope.situation.dateDeValeur).format('MMMM YYYY');

    $scope.individuLabel = IndividuService.label($scope.individu);

    $scope.ressourceTypes = _.keyBy(ressourceTypes, 'id');
    $scope.isNumber = angular.isNumber;

    _.forEach($scope.selectedRessourceTypes, function(value, key) {
        RessourceService.setDefaultRessourceValue($scope.situation.dateDeValeur, $scope.individu, $scope.ressourceTypes[key]);
    });

    $scope.submit = function(form) {
        form.submitted = true;
        if (form.$valid) {
            $scope.individu.hasRessources = ! _.isEmpty($scope.selectedRessourceTypes);
            $scope.declareNextIndividuResources(parseInt($stateParams.individu));
        }
    };
});
