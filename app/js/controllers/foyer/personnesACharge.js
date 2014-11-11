'use strict';

angular.module('ddsApp').controller('FoyerPersonnesAChargeCtrl', function($scope) {
    $scope.personnesACharge = [];

    $scope.$on('individu.personneACharge', function(e, personneACharge) {
        $scope.personnesACharge.push(personneACharge);
        $scope.ajoutPersonneACharge = false;
    });

    $scope.removePersonneACharge = function(personneACharge) {
        var index = $scope.personnesACharge.indexOf(personneACharge);
        $scope.personnesACharge.splice(index, 1);
    };

    $scope.validate = function() {
        $scope.$emit('personnesACharge', $scope.personnesACharge);
    };
});
