'use strict';

angular.module('ddsApp').service('ResultatService', function($http, $modal, droitsDescription) {
    function processOpenfiscaResult(openfiscaResult) {
        var droitsEligibles = {};
        var prestationsNationales = extractMontants(droitsDescription.prestationsNationales, openfiscaResult.calculatedPrestations);
        if (! _.isEmpty(prestationsNationales)) {
            droitsEligibles.prestationsNationales = prestationsNationales;
        }
        [ 'prestationsNationales', 'partenairesLocaux' ].forEach(function(type) {
            droitsEligibles[type] = {};

            Object.keys(droitsDescription[type]).forEach(function(provider) {
                var result = extractMontants(droitsDescription[type][provider].prestations, openfiscaResult.calculatedPrestations);

                if (_.isEmpty(result))
                    return;

                Object.keys(result).forEach(function(aideId) {
                    result[aideId].imgSrc = droitsDescription[type][provider].imgSrc;
                });

                droitsEligibles[type][provider] = result;
            });
        });

        droitsEligibles.prestationsNationales = _.reduce(droitsEligibles.prestationsNationales, function(result, droits, provider) {
            return _.assign(result, droits);  // flatten all national prestations
        }, {});

        return {
            raw: openfiscaResult,
            droitsEligibles: droitsEligibles,
            droitsInjectes: openfiscaResult.injectedPrestations.map(function(prestationName) {
                var result;
                Object.keys(droitsDescription.prestationsNationales).some(function(provider) {
                    return (result = droitsDescription.prestationsNationales[provider].prestations[prestationName]);
                });
                return result;
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
