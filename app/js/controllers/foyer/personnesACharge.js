'use strict';

angular.module('ddsApp').controller('FoyerPersonnesAChargeCtrl', function($scope, $location, $anchorScroll, $timeout) {
    $scope.personnes = _.where($scope.situation.individus, { role: 'personneACharge' }).concat(_.where($scope.situation.individus, { role: 'enfant' }));

    var addPersonne = function(personne) {
        $scope.personnes.push(personne);
        $scope.ajoutPersonne = false;
    };

    $scope.$on('individu.personne', function(e, personne) {
        addPersonne(personne);
    });

    $scope.$on('individu.enfant', function(e, enfant) {
        addPersonne(enfant);
    });

    $scope.newPersonne = function() {
        $scope.ajoutPersonne = true;
        $location.hash('form-new-personne');
        $timeout(function() {
            $anchorScroll();
        });
    };

    $scope.removePersonne = function(personne) {
        var index = $scope.personnes.indexOf(personne);
        $scope.personnes.splice(index, 1);
    };

    $scope.validate = function() {
        $scope.$emit('personnesACharge', $scope.personnes);
    };
});
