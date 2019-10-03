'use strict';

angular.module('ddsApp').controller('FoyerEnfantsCtrl', function($scope, $state) {
    $scope.allowValidation = function() { return $state.current.name == 'foyer.enfants'; };
    $scope.isActive = function(enfant) { return $state.current.name == 'foyer.enfants.modifier' && $state.params.id == enfant.id; };

    $scope.enfants = _.filter($scope.situation.individus, { role: 'enfant' });

    $scope.$on('actionCancelled', function() {
        $state.go('foyer.enfants');
    });

    $scope.removeEnfant = function(enfant) {
        var index = $scope.enfants.indexOf(enfant);
        $scope.enfants.splice(index, 1);
        $scope.$emit('enfant', $scope.enfants);

        $state.go('foyer.enfants', {}, { location: 'replace' });
    };

    $scope.validate = function() {
        $scope.$emit('enfants', $scope.enfants);
    };

    $scope.displayPreviousButton = true;

    $scope.previous = function() {
        $state.go('foyer.demandeur');
    };

    $scope.displayEndButton = true;

    $scope.end = function() {
        $scope.validate();
        $state.go('foyer.resultat');
    };
});

angular.module('ddsApp').controller('FoyerNewEnfantCtrl', function($scope, $state, $anchorScroll, $timeout) {

    $scope.isNew = true;

    // Called when the form is submitted & valid
    $scope.$on('individu.enfant', function(e, enfant) {
        $scope.enfants.push(enfant);
        $scope.$emit('enfant', $scope.enfants);

        $state.go('foyer.enfants');
    });

    $timeout(function() { $anchorScroll('enfant-form'); });
});

angular.module('ddsApp').controller('FoyerEnfantCtrl', function($scope, $state) {

    $scope.isNew = false;

    // Called when the form is submitted & valid
    $scope.$on('individu.enfant', function(e, enfant) {

        var resolved = _.find($scope.enfants, function(item) {
            return item.id === enfant.id;
        });

        var index = $scope.enfants.indexOf(resolved);
        if (-1 !== index) {
            $scope.enfants.splice(index, 1, enfant);
        }

        $state.go('foyer.enfants');
    });
});
