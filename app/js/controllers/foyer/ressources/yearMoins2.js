'use strict';

angular.module('ddsApp').controller('FoyerRessourceYearMoins2Ctrl', function($scope) {
    $scope.yearMoins2 = moment().subtract('years', 2).format('YYYY');
    $scope.demandeur = _.find($scope.situation.individus, { role: 'demandeur' });
    $scope.conjoint = _.find($scope.situation.individus, { role: 'conjoint' });
});
