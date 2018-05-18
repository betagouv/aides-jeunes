'use strict';

angular.module('ddsApp').controller('FoyerEnfantsCtrl', function($scope, $state) {

    $scope.enfants = _.filter($scope.situation.individus, { role: 'enfant' });

    $scope.$on('actionCancelled', function() {
        $scope.activeEnfant = null;
        $state.go('foyer.enfants');
    });

    $scope.removeEnfant = function(enfant) {
        var index = $scope.enfants.indexOf(enfant);
        $scope.enfants.splice(index, 1);

        if ('foyer.enfants' !== $state.current.name) {
            $state.go('foyer.enfants', {}, { location: 'replace' });
        }
    };

    $scope.validate = function() {
        $scope.$emit('enfants', $scope.enfants);
    };

    $scope.activeEnfant = null;
});

angular.module('ddsApp').controller('FoyerNewEnfantCtrl', function($scope, $state, $anchorScroll, $timeout) {

    $scope.isNew = true;

    // Called when the form is submitted & valid
    $scope.$on('individu.enfant', function(e, enfant) {

        $scope.enfants.push(enfant);

        // Use location = replace to clear history
        // https://github.com/angular-ui/ui-router/wiki/Quick-Reference#options
        $state.go('foyer.enfants', {}, { location: 'replace' });

        $scope.$parent.activeEnfant = null;
    });

    $timeout(function() { $anchorScroll('enfant-form'); });
});

angular.module('ddsApp').controller('FoyerEnfantCtrl', function($scope, $state, $stateParams) {

    $scope.isNew = false;

    // Called when the form is submitted & valid
    $scope.$on('individu.enfant', function(e, enfant) {

        var index = $scope.enfants.indexOf(enfant);
        if (-1 !== index) {
            $scope.enfants.splice(index, 1, enfant);
        }

        // Use location = replace to clear history
        // https://github.com/angular-ui/ui-router/wiki/Quick-Reference#options
        $state.go('foyer.enfants', {}, { location: 'replace' });

        $scope.$parent.activeEnfant = null;
    });

    var enfant = _.find($scope.situation.individus, {
        role: 'enfant',
        id: $stateParams.id
    });

    if (enfant) {
        $scope.individu = enfant;
        $scope.$parent.activeEnfant = enfant;
    }
});
