'use strict';

angular.module('ddsApp').controller('FoyerRecapLogementCtrl', function($scope, $http, logementTypes) {
    var locationTypes = _.find(logementTypes, { id: 'locataire' }).locationTypes;

    $scope.locationTypeLabel = function() {
        return _.find(locationTypes, { id: $scope.situation.logement.locationType }).label;
    };

    $scope.logementTypeLabel = function() {
        return _.find(logementTypes, { id: $scope.situation.logement.type }).label;
    };

    $scope.loyerLabel = function() {
        return 'Votre ' + ('proprietaire' === $scope.situation.logement.type ? 'mensualité d\'emprunt' : 'loyer (hors charges)');
    };
});
