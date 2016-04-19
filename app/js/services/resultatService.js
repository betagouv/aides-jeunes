'use strict';

angular.module('ddsApp').service('ResultatService', function($http, $modal, droitsDescription) {

    function processOpenfiscaResult(openfiscaResult) {
        var droitsEligibles = { partenairesLocaux: {} };
        var calculatedPrestations = openfiscaResult.calculatedPrestations;
        droitsEligibles.prestationsNationales = extractMontants(droitsDescription.prestationsNationales, calculatedPrestations);
        _.forEach(droitsDescription.partenairesLocaux, function(partenaire) {
            droitsEligibles.partenairesLocaux[partenaire.id] = extractMontants(partenaire.prestations, calculatedPrestations);
        });
        return {
            droitsEligibles: droitsEligibles,
            droitsInjectes: openfiscaResult.injectedPrestations.map(function(prestationName) {
                return droitsDescription.prestationsNationales[prestationName];
            }),
        };
    }

    function extractMontants(prestationsList, openfiscaResult) {
        return _.reduce(prestationsList, function(result, droit, droitId) {
            if (openfiscaResult[droitId]) {
                result[droitId] = Object.assign(droit, { montant: openfiscaResult[droitId] });
            }
            return result;
        }, {});
    }

    return {
        processOpenfiscaResult: processOpenfiscaResult,
        simulate: function(situation) {
            return $http.get('/api/situations/' + situation._id + '/simulation', {
                params: { cacheBust: Date.now() }
            }).then(function(response) {
                return processOpenfiscaResult(response.data);
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
