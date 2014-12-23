'use strict';

angular.module('ddsApp').controller('FoyerRessourceRfrCtrl', function($scope) {
    $scope.yearMoins2 = moment().subtract('years', 2).format('YYYY');
    $scope.yearMoins1 = moment().subtract('years', 1).format('YYYY');
    $scope.rfr = $scope.situation.rfr || 0;

    $scope.submit = function() {
        $scope.$emit('rfr', $scope.rfr);
    };
});
