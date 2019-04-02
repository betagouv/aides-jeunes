'use strict';

angular.module('ddsApp').service('ResultatService', function($http, $rootScope, droitsDescription, CustomizationService) {

    var _loading = false;

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
        if (aide.type && aide.type !== 'float') {
            return amount;
        }

        var rounding = aide.floorAt || 1;
        return Math.floor(amount / rounding) * rounding;
    }

    function computeAides(situation, openfiscaResponse, showPrivate) {
        var period = moment(situation.dateDeValeur).format('YYYY-MM');
        var customizationId = CustomizationService.determineCustomizationId(openfiscaResponse, period);

        var computedRessources = normalizeOpenfiscaRessources(openfiscaResponse);

        var result = {
            eligibleAides: {},
            nonEligibleAides: {},
            injectedAides: [], // declared by the user
        };

        _.mapValues(droitsDescription, function(aidesProviders, aidesLevel) {
            result.eligibleAides[aidesLevel] = {};
            result.nonEligibleAides[aidesLevel] = {};

            _.mapValues(aidesProviders, function(aidesProvider, aidesProviderId) {
                _.forEach(aidesProvider.prestations, function(aide, aideId) {
                    if ((! showPrivate) && aide.private) {
                        return;
                    }

                    if (_.some(situation.individus, function(individu) { return wasInjected(aideId, individu); })) {
                        return result.injectedAides.push(aide);
                    }

                    var value = valueAt(aideId + '_non_calculable', computedRessources, period);

                    if ((! value) || value === 'calculable') {
                        value = round(valueAt(aideId, computedRessources, period), aide);
                    }

                    var dest = (value) ? result.eligibleAides[aidesLevel] : result.nonEligibleAides[aidesLevel];
                    dest[aideId] = _.assign({},
                        aide,
                        {
                            id: aideId,
                            montant: value,
                            provider: aidesProvider,
                            providerId: aidesProviderId,
                        },
                        customizationId && aide.customization && aide.customization[customizationId]
                    );
                });
            });
        });

        var localGroups = _.groupBy(result.eligibleAides.partenairesLocaux, 'providerId');
        result.eligibleAides.partenairesLocaux = Object.keys(localGroups).map(function(partenaireLocal) {
            return _.assign({}, localGroups[partenaireLocal][0].provider, {
                prestations: localGroups[partenaireLocal].reduce(function(obj, prestation) {
                    obj[prestation.id] = prestation;
                    return obj;
                }, {})
            });
        });

        return {
            droitsEligibles: result.eligibleAides,
            droitsNonEligibles: result.nonEligibleAides,
            droitsInjectes: result.injectedAides,
        };
    }

    function simulate(situation, showPrivate) {
        setLoading(true);
        return $http.get('api/situations/' + situation._id + '/openfisca-response')
            .then(function(OpenfiscaResponse) {
                return OpenfiscaResponse.data;
            }).then(function(openfiscaResponse) {
                return computeAides(situation, openfiscaResponse, showPrivate);
            }).finally(function() {
                setLoading(false);
            });
    }

    function setLoading(loading) {
        if (loading !== _loading) {
            $rootScope.$broadcast('resultat:loading:changed', loading);
        }
        _loading = loading;
    }

    function isLoading() {
        return _loading;
    }

    return {
        _computeAides: computeAides,  // exposed for testing only
        round: round, // exposed for testing only
        simulate: simulate,
        isLoading: isLoading
    };
});
