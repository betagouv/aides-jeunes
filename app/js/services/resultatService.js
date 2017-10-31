'use strict';

angular.module('ddsApp').service('ResultatService', function($http, droitsDescription, CustomizationService) {

    /**
    * OpenFisca test cases separate ressources between two entities: individuals and families.
    * In Mes Aides, we don't care about this separation and want to show eligibilty results for the demandeur only.
    *@param    {Object}  An Openfisca test case. <https://doc.openfisca.fr/openfisca-web-api/input-output-data.html#test-cases>
    *@return   {Object}  A new object containing the ressources of the family and of the individual. The family ressources will be overridden if conflicting.
    */
    function normalizeOpenfiscaRessources(testCase) {
        return _.merge({}, testCase.familles._, testCase.individus.demandeur);
    }

    function valueAt(ressourceId, ressources, period) {
        return ressources[ressourceId] && ressources[ressourceId][period];
    }

    function wasInjected(ressourceId, ressources) {
        return _.reduce(ressources[ressourceId], function(result, value) {
            return result || value;
        }, false);
    }

    function computeAides(situation, openfiscaResponse) {
        var period = moment(situation.dateDeValeur).format('YYYY-MM');
        var customizationId = CustomizationService.determineCustomizationId(openfiscaResponse, period);

        var computedRessources = normalizeOpenfiscaRessources(openfiscaResponse);

        var result = {
            eligibleAides: undefined,
            injectedAides: [],
        };

        result.eligibleAides = _.mapValues(droitsDescription, function(aidesProviders) {
            return _.mapValues(aidesProviders, function(aidesProvider) {

                var eligibleAides = _.mapValues(aidesProvider.prestations, function(aide, aideId) {

                    if (wasInjected(aideId, situation.individus[0])) {
                        result.injectedAides.push(aide);
                        return;  // the aides were declared, do not re-compute the results
                    }

                    var value = valueAt(aideId + '_non_calculable', computedRessources, period) || valueAt(aideId, computedRessources, period);

                    if (! value) return;

                    return _.assign({},
                        aide,
                        {
                            montant: value,
                            provider: aidesProvider,
                        },
                        customizationId && aide.customization && aide.customization[customizationId]
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
        return $http.get('api/situations/' + situation._id + '/openfisca-response')
        .then(function(OpenfiscaResponse) {
            return OpenfiscaResponse.data;
        }).then(function(openfiscaResponse) {
            return computeAides(situation, openfiscaResponse);
        });
    }

    return {
        _computeAides: computeAides,  // exposed for testing only
        simulate: simulate
    };
});
