'use strict';

angular.module('ddsApp').controller('FoyerPersonnesAChargeCtrl', function($scope, $location, $anchorScroll, $timeout, SituationService) {
    var situation = SituationService.restoreLocal();
    $scope.personnesACharge = _.where(situation.individus, { role: 'personneACharge' });

    $scope.$on('individu.personneACharge', function(e, personneACharge) {
        $scope.personnesACharge.push(personneACharge);
        $scope.ajoutPersonneACharge = false;
    });

    $scope.newPersonneACharge = function() {
        $scope.ajoutPersonneACharge = true;
        $location.hash('form-new-personne-a-charge');
        $timeout(function() {
            $anchorScroll();
        });
    };

    $scope.removePersonneACharge = function(personneACharge) {
        var index = $scope.personnesACharge.indexOf(personneACharge);
        $scope.personnesACharge.splice(index, 1);
    };

    $scope.validate = function() {
        $scope.$emit('personnesACharge', $scope.personnesACharge);
    };
});
