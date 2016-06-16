'use strict';

angular.module('ddsApp').service('ResultatService', function($http, $uibModal, droitsDescription) {

    function processOpenfiscaResult(openfiscaResult) {
        var droitsEligibles = {};
        var calculatedPrestations = openfiscaResult.calculatedPrestations;
        var prestationsNationales = extractMontants(droitsDescription.prestationsNationales, calculatedPrestations);
        if (! _.isEmpty(prestationsNationales)) {
            droitsEligibles.prestationsNationales = prestationsNationales;
        }
        _.forEach(droitsDescription.partenairesLocaux, function(partenaire, partenaireId) {
            var partenairePrestations = extractMontants(partenaire.prestations, calculatedPrestations);
            if (! _.isEmpty(partenairePrestations)) {
                droitsEligibles.partenairesLocaux = droitsEligibles.partenairesLocaux || {};
                droitsEligibles.partenairesLocaux[partenaireId] = partenairePrestations;
            }
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
                result[droitId] = _.assign(droit, { montant: openfiscaResult[droitId] });
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
                $uibModal.open({
                    templateUrl: '/partials/error-modal.html',
                    controller: ['$scope', function($scope) {
                        $scope.error = error;
                    }]
                });
            });
        }
    };
});
