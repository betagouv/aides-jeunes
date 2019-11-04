var _ = require('lodash');
var moment = require('moment');
var droitsDescription = require('../../../app/js/constants/benefits/');
var determineCustomizationId = require('./customization');

/**
 * OpenFisca test cases separate ressources between two entities: individuals and families.
 * In Mes Aides, we don't care about this separation and want to show eligibilty results for the demandeur only.
 * @param    {Object}  An Openfisca test case. <https://doc.openfisca.fr/openfisca-web-api/input-output-data.html#test-cases>
 * @return   {Object}  A new object containing the ressources of the family and of the individual. The family ressources will be overridden if conflicting.
 */
function normalizeOpenfiscaRessources(testCase) {
    var individuId = testCase.menages._.personne_de_reference[0];
    return _.merge({}, testCase.menages._, testCase.familles._, testCase.individus.demandeur || testCase.individus[individuId]);
}

function valueAt(ressourceId, ressources, period, aide) {
    if (aide && aide.compute) {
        return aide.compute(ressources, period);
    } else {
        return ressources[ressourceId] && ressources[ressourceId][period];
    }
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
    var customizationId = determineCustomizationId(openfiscaResponse, period);
    var computedRessources = normalizeOpenfiscaRessources(openfiscaResponse);

    var result = {
        droitsEligibles: [],
        droitsNonEligibles: [],
        droitsInjectes: [], // declared by the user
    };

    forEach((aide, aideId, aidesProvider, aidesProviderId) => {
        if ((! showPrivate) && aide.private) {
            return;
        }

        if (_.some(situation.individus, function(individu) { return valueAt(aideId, individu, period) !== undefined; })) {
            return result.droitsInjectes.push(aide);
        }

        var value = valueAt(aideId + '_non_calculable', computedRessources, period);

        if ((! value) || value === 'calculable') {
            value = round(valueAt(aideId, computedRessources, period, aide), aide);
        }

        var dest = (value) ? result.droitsEligibles : result.droitsNonEligibles;
        dest.push(_.assign({},
            aide,
            {
                id: aideId,
                montant: value,
                provider: aidesProvider,
                providerId: aidesProviderId,
            },
            customizationId && aide.customization && aide.customization[customizationId]
        ));
    });

    Object.keys(result).forEach(function(group) {
        result[group] = _.sortBy(result[group], ['top', 'label']);
    });

    return result;
}

/**
 * This function iterates over the nested benefits, and executes a callback.
 * The callback is called with 4 parameters:
 * - benefit: the benefit object
 * - benefitId: the benefit id
 * - provider: the benefit provider id
 * - providerId: the benefit provider id
 */
function forEach(cb) {
    _.mapValues(droitsDescription, function(aidesProviders) {
        _.mapValues(aidesProviders, function(aidesProvider, aidesProviderId) {
            _.forEach(aidesProvider.prestations, function(aide, aideId) {
                cb(aide, aideId, aidesProvider, aidesProviderId);
            });
        });
    });
}

exports.computeAides = computeAides;
exports.round = round;
exports.forEach = forEach;
