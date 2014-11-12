'use strict';

angular.module('ddsApp').controller('FoyerConjointCtrl', function($scope) {
    if (_.find($scope.situation.individus, { role: 'conjoint' })) {
        $scope.vitEnCouple = true;
    }
});
