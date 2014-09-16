'use strict';

angular.module('ddsApp').controller('FoyerRecapLogementCtrl', function($scope, $http, logementTypes, situation) {
    $scope.situation = situation;

    var locationTypes = _.find(logementTypes, { id: 'locataire' }).locationTypes;

    $scope.locationTypeLabel = function() {
        return _.find(locationTypes, { id: situation.logement.locationType }).label;
    };

    $scope.logementTypeLabel = function() {
        return _.find(logementTypes, { id: situation.logement.type }).label;
    };

    $scope.loyerLabel = function() {
        return 'Votre ' + ('proprietaire' === situation.logement.type ? 'mensualité d\'emprunt' : 'loyer (hors charges)');
    };
});
