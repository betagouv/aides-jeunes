'use strict';

angular.module('ddsApp').service('ResultatService', function($http, droitsDescription) {

    function extractPeriod(openfiscaKey) {
        return openfiscaKey.split(':')[1];
    }

    function mergeEntityRessources(testCase) {
        return _.merge(testCase.familles[0], testCase.individus[0]);
    }

    function processOpenfiscaResult(openfiscaResponse) {
        var request = openfiscaResponse.params.scenarios[0];
        var requestTestCase = request.test_case;
        var responseRessources = mergeEntityRessources(openfiscaResponse.value[0]);
        var requestRessources = mergeEntityRessources(requestTestCase);

        var currentPeriod = extractPeriod(request.period);

        function valueForCurrentPeriod(collection, key) {
            return collection[key] && collection[key][currentPeriod];
        }
        var injectedPrestations = [];

        var fullSet = _.mapValues(droitsDescription, function(levelData, levelKey) {
            return _.mapValues(levelData, function(providerData, providerKey) {
                var eligiblePrestations = {};

                _.forEach(providerData.prestations, function(prestationData, prestationKey) {
                    if (valueForCurrentPeriod(requestRessources, prestationKey)) {
                        injectedPrestations.push(prestationData);
                    } else {
                        var montant = valueForCurrentPeriod(responseRessources, prestationKey) ||
                            valueForCurrentPeriod(responseRessources, prestationKey + '_non_calculable') || false;

                        if (montant) {
                            eligiblePrestations[prestationKey] = _.assign(_.clone(prestationData), {montant: montant, provider: providerData});
                        }
                    }
                });
                return _.assign(_.clone(providerData), {prestations: eligiblePrestations});
            });
        });

        fullSet.prestationsNationales = _.reduce(fullSet.prestationsNationales, function(result, providerData) {
            return _.assign(result, providerData.prestations); // flatten all national prestations
        }, {});

        fullSet.partenairesLocaux = _.omitBy(fullSet.partenairesLocaux, function(providerData, providerKey) {
            return ! _.keys(providerData.prestations).length; // exclude partenaires without eligible prestations
        });

        return {
            droitsEligibles: fullSet,
            droitsInjectes: injectedPrestations
        };
    }

    return {
        processOpenfiscaResult: processOpenfiscaResult,
        simulate: function(situation) {
            return $http.get('/api/situations/' + situation._id + '/simulation', {
                params: { cacheBust: Date.now() }
            }).then(function(response) {
                var test = processOpenfiscaResult(response.data);
                return test;
            });
        }
    };
});
