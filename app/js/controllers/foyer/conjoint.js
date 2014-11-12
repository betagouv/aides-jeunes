'use strict';

angular.module('ddsApp').controller('FoyerConjointCtrl', function($scope, SituationService) {
    var situation = SituationService.restoreLocal();
    if (_.find(situation.individus, { role: 'conjoint' })) {
        $scope.vitEnCouple = true;
    }
});
