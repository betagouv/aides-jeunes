'use strict';

angular.module('ddsApp').service('ResultatService', function($http, $modal, droitsDescription) {

    var DROITS_POTENTIELS = droitsDescription.prestationsNationales.concat(
        _.flatten(_.pluck(droitsDescription.partenairesLocaux, 'prestations'))
    );

    // Si la valeur renvoyée par l'API vaut null, cela signifie par convention que l'aide a été injectée et non recaculée par le simulateur
    function sortDroits(droitsCalcules) {
        var droitsEligibles = {},
            droitsInjectes = {};

        _.forEach(DROITS_POTENTIELS, function(droit) {
            if (droitsCalcules[droit.id]) {
                droitsEligibles[droit.id] = droit;
                droitsEligibles[droit.id].montant = droitsCalcules[droit.id];
            } else if (droitsCalcules[droit.id] === null) {
                droitsInjectes[droit.id] = droit;
            }
        });
        return {
            droitsEligibles: droitsEligibles,
            droitsInjectes: droitsInjectes,
        };
    }

    return {
        sortDroits: sortDroits,
        simulate: function(situation) {
            return $http.get('/api/situations/' + situation._id + '/simulation', {
                params: { cacheBust: Date.now() }
            }).then(function(response) {
                return sortDroits(response.data);
            }).catch(function(error) {
                $modal.open({
                    templateUrl: '/partials/error-modal.html',
                    controller: ['$scope', function($scope) {
                        $scope.error = error;
                    }]
                });
            });
        }
    };
});
