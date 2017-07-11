'use strict';

angular.module('ddsApp').service('ResultatService', function($http, droitsDescription, CustomizationService) {

    /**
    *@param    {String}  An Openfisca period. For example: 'month:2014-12'.
    *@return   {String}  The ISO-like month descriptor, in the 'YYYY-MM' format.
    */
    function normalizePeriod(openfiscaKey) {
        return openfiscaKey.split(':')[1];
    }

    /**
    * OpenFisca test cases separate ressources between two entities: individuals and families.
    * In Mes Aides, we don't care about this separation and want to show eligibilty results for the demandeur only.
    *@param    {Object}  An Openfisca test case. <https://doc.openfisca.fr/openfisca-web-api/input-output-data.html#test-cases>
    *@return   {Object}  A new object containing the ressources of the family and of the individual. The family ressources will be overridden if conflicting.
    */
    function normalizeRessources(testCase) {
        return _.merge({}, testCase.familles[0], testCase.individus[0]);
    }

    function normalizeSituation(openfiscaSituation) {
        var period = normalizePeriod(openfiscaSituation.period);
        return {
            period: period,
            ressources: normalizeRessources(openfiscaSituation.test_case),
            customizationId: CustomizationService.determineCustomizationId(openfiscaSituation.test_case, period),
        };
    }

    function valueAt(ressourceId, ressources, period) {
        return ressources[ressourceId] && ressources[ressourceId][period];
    }

    function wasInjected(ressourceId, ressources) {
        return _.reduce(ressources[ressourceId], function(result, value) {
            return result || value;
        }, false);
    }

    function computeAides(openfiscaResponse) {
        var situation = normalizeSituation(openfiscaResponse.params.scenarios[0]);
        var computedRessources = normalizeRessources(openfiscaResponse.value[0]);

        var result = {
            eligibleAides: undefined,
            injectedAides: [],
        };

        result.eligibleAides = _.mapValues(droitsDescription, function(aidesProviders) {
            return _.mapValues(aidesProviders, function(aidesProvider) {

                var eligibleAides = _.mapValues(aidesProvider.prestations, function(aide, aideId) {

                    if (wasInjected(aideId, situation.ressources)) {
                        result.injectedAides.push(aide);
                        return;  // the aides were declared, do not re-compute the results
                    }

                    var value = valueAt(aideId + '_non_calculable', computedRessources, situation.period) || valueAt(aideId, computedRessources, situation.period);

                    if (! value) return;

                    return _.assign({},
                        aide,
                        {
                            montant: value,
                            provider: aidesProvider,
                        },
                        situation.customizationId && aide.customization && aide.customization[situation.customizationId]
                    );
                });

                return _.assign({}, aidesProvider, { prestations: _.pickBy(eligibleAides) });
            });
        });

        result.eligibleAides.prestationsNationales = _.reduce(result.eligibleAides.prestationsNationales, function(aides, aidesProvider) {
            return _.assign(aides, aidesProvider.prestations);  // flatten all national prestations
        }, {});

        result.eligibleAides.partenairesLocaux = _.pickBy(result.eligibleAides.partenairesLocaux, function(aidesProvider) {
            return _.keys(aidesProvider.prestations).length;  // exclude partenaires with no eligible prestations
        });

        return {
            droitsEligibles: result.eligibleAides,
            droitsInjectes: result.injectedAides,
        };
    }

    function simulate(situation) {
        return $http.get('/api/situations/' + situation._id + '/simulation', {
            params: { cacheBust: Date.now() }
        }).then(function(response) {
            return response.data;
        }).then(computeAides);
    }

    return {
        _processOpenfiscaResult: computeAides,  // exposed for testing only
        simulate: simulate
    };
});
