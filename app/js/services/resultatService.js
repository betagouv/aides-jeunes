'use strict';

angular.module('ddsApp').service('ResultatService', function($http, droitsDescription, CustomizationService) {

    /**
    * OpenFisca test cases separate ressources between two entities: individuals and families.
    * In Mes Aides, we don't care about this separation and want to show eligibilty results for the demandeur only.
    *@param    {Object}  An Openfisca test case. <https://doc.openfisca.fr/openfisca-web-api/input-output-data.html#test-cases>
    *@return   {Object}  A new object containing the ressources of the family and of the individual. The family ressources will be overridden if conflicting.
    */
    function normalizeOpenfiscaRessources(testCase) {
        var individuId = testCase.menages._.personne_de_reference[0];
        return _.merge({}, testCase.menages._, testCase.familles._, testCase.individus.demandeur || testCase.individus[individuId]);
    }

    function valueAt(ressourceId, ressources, period) {
        return ressources[ressourceId] && ressources[ressourceId][period];
    }

    function wasInjected(ressourceId, ressources) {
        return _.reduce(ressources[ressourceId], function(result, value) {
            return result || value;
        }, false);
    }

    function round(amount, aide) {
        if ((aide.type || 'float') != 'float') {
            return amount;
        } else if (! aide.unit && aide.roundToNearest10 !== false && (! aide.roundToNearestCent)) {
            return Math.round(amount / 10) * 10;
        } else if (aide.roundToNearestCent) {
            return Math.round(amount * 100) / 100;
        } else {
            return Math.round(amount);
        }
    }

    function computeEligibleAides(situation, computedRessources, period, customizationId, aidesProvider, injectedAides, isEligible, aide, aideId) {

        if (_.some(situation.individus, function(individu) { return wasInjected(aideId, individu); })) {
            injectedAides.push(aide);
            return;  // the aides were declared, do not re-compute the results
        }

        var value = valueAt(aideId + '_non_calculable', computedRessources, period);

        if ((! value) || value === 'calculable') {
            value = round(valueAt(aideId, computedRessources, period), aide);
        }

        if (isEligible) {
            if (! value) return;

            return _.assign({},
                aide,
                {
                    montant: value,
                    provider: aidesProvider,
                },
                customizationId && aide.customization && aide.customization[customizationId]
            );
        } else {
            if (value) return;

            return _.assign({},
                aide,
                {
                    montant: 0,
                    provider: aidesProvider,
                },
                customizationId && aide.customization && aide.customization[customizationId]
            );
        }
    }

    function computeAides(situation, openfiscaResponse) {
        var period = moment(situation.dateDeValeur).format('YYYY-MM');
        var customizationId = CustomizationService.determineCustomizationId(openfiscaResponse, period);

        var computedRessources = normalizeOpenfiscaRessources(openfiscaResponse);

        var result = {
            eligibleAides: undefined,
            nonEligibleAides: undefined,
            injectedAides: [], // declared by the user
        };

        result.eligibleAides = _.mapValues(droitsDescription, function(aidesProviders) {
            return _.mapValues(aidesProviders, function(aidesProvider) {
                var callback = computeEligibleAides.bind(null, situation, computedRessources, period, customizationId, aidesProvider, result.injectedAides, true);
                var eligibleAides = _.mapValues(aidesProvider.prestations, callback);

                return _.assign({}, aidesProvider, { prestations: _.pickBy(eligibleAides) });
            });
        });

        result.nonEligibleAides = _.mapValues(droitsDescription, function(aidesProviders) {
            return _.mapValues(aidesProviders, function(aidesProvider) {
                var callback = computeEligibleAides.bind(null, situation, computedRessources, period, customizationId, aidesProvider, result.injectedAides, false);
                var eligibleAides = _.mapValues(aidesProvider.prestations, callback);

                return _.assign({}, aidesProvider, { prestations: _.pickBy(eligibleAides) });
            });
        });

        result.eligibleAides.prestationsNationales = _.reduce(result.eligibleAides.prestationsNationales, function(aides, aidesProvider) {
            return _.assign(aides, aidesProvider.prestations);  // flatten all national prestations
        }, {});

        result.nonEligibleAides.prestationsNationales = _.reduce(result.nonEligibleAides.prestationsNationales, function(aides, aidesProvider) {
            return _.assign(aides, aidesProvider.prestations);  // flatten all national prestations
        }, {});

        result.eligibleAides.partenairesLocaux = _.pickBy(result.eligibleAides.partenairesLocaux, function(aidesProvider) {
            return _.keys(aidesProvider.prestations).length;  // exclude partenaires with no eligible prestations
        });

        return {
            droitsEligibles: result.eligibleAides,
            droitsNonEligibles: result.nonEligibleAides,
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
