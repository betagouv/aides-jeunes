var moment = require('moment');
var _ = require('lodash');

var common = require('./common');
var schema = require('./schema');
var ressources =  require('./ressources');

var propertyMove = require('./propertyMove');
var categoriesRnc = require('../../../../app/js/constants/ressources.js').categoriesRnc;
exports.movePropertiesToIndividuEntity = propertyMove.movePropertiesToIndividuEntity;
exports.movePropertyValuesToGroupEntity = propertyMove.movePropertyValuesToGroupEntity;

function allocateIndividualsToEntities(situation) {
    var famille = situation.famille;
    var foyer = situation.foyer_fiscal;
    var menage = situation.menage;

    var demandeurId = common.getDemandeur(situation).id;

    var conjoint = common.getConjoint(situation);
    var conjointId = conjoint && conjoint.id;

    famille.parents = [ demandeurId ];
    foyer.declarants = [ demandeurId ];
    menage.personne_de_reference = demandeurId;
    if (conjointId) {
        famille.parents.push(conjointId);
        foyer.declarants.push(conjointId);
        menage.conjoint = conjointId;
    }

    var enfants = common.getEnfants(situation);
    var validEnfants = _.filter(enfants, function(enfant) { return common.isIndividuValid(enfant, situation); });
    var enfantIds = validEnfants.map(function(enfant) { return enfant.id; });
    famille.enfants = enfantIds;
    foyer.personnes_a_charge = enfantIds;
    menage.enfants = enfantIds;
}

function setNonInjectedPrestationsToZero(familles, individus, dateDeValeur) {
    var subjects = {
        famille: familles,
        individu: individus,
    };

    var prestationsFinancieres = _.pickBy(common.requestedVariables, function(definition) {
        return (! definition.type) || definition.type === 'float';
    });

    _.forEach(prestationsFinancieres, function(definition, prestationName) {
        _.forEach(subjects[definition.entity || 'famille'], function(entity) {
            _.forEach(common.getPeriods(dateDeValeur).last12Months, function(period) {
                entity[prestationName] = entity[prestationName] || {};
                entity[prestationName][period] = entity[prestationName][period] || 0;
            });
        });
    });
}


function copyTo3PreviousMonths(testCase, dateDeValeur) {
    var periodKeys = ['thisMonth', '1MonthsAgo', '2MonthsAgo', '3MonthsAgo'];
    var periods = common.getPeriods(dateDeValeur);

    var forDuplication = schema.forDuplication;
    Object.keys(forDuplication).forEach(function(entityName) {
        forDuplication[entityName].forEach(function(entityPropertyName) {
            testCase[entityName].forEach(function(entity) {
                var value = entity[entityPropertyName];
                var result = {};
                if (value !== undefined) {
                    periodKeys.forEach(function(periodKey) {
                        result[periods[periodKey]] = value;
                    });
                    entity[entityPropertyName] = result;
                }
            });
        });
    });
}

function applyRessources(ressourceInput, ressourceOutput, mappingSchema) {
    _.forEach(mappingSchema, function(sourceDefinitions, outputKey) {
        if (sourceDefinitions === outputKey)
            return;
        if (! _.isArray(sourceDefinitions)) {
            sourceDefinitions = [sourceDefinitions];
        }
        ressourceOutput[outputKey] = {};
        var result = ressourceOutput[outputKey];
        _.forEach(sourceDefinitions, function(definition) {
            var srcKey = definition.src || definition;
            var fn = definition.fn || function(x) { return x; };

            _.forEach(ressourceInput[srcKey], function(value, period) {
                result[period] = result[period] || 0;
                result[period] += fn(value);
            });
        });

        if (! Object.keys(ressourceOutput[outputKey]).length) {
            delete ressourceOutput[outputKey];
        }
    });
}


function duplicateRessourcesForAnneeFiscaleDeReference(individu, dateDeValeur) {
    var periods = common.getPeriods(dateDeValeur);
    Object.keys(ressources.individu).forEach(function(ressourceName) {
        var result = individu[ressourceName];
        if (! result)
            return;
        // Variables can be defined on a yearly or a monthly basis
        if (result[periods.lastYear]) {
            result[periods.anneeFiscaleReference] = result[periods.lastYear];
        } else {
            var sumOverLast12Months = periods.last12Months.reduce(function(sum, periodObject) {
                return sum + result[periodObject];
            }, 0);
            if (sumOverLast12Months) {
                periods.anneeFiscaleReference12Months.forEach(function(month) {
                    result[month] = sumOverLast12Months / 12;
                });
            }
        }
    });
}

function ressourcesYearMoins2Captured(situation) {
    var yearMoins2 = moment(situation.dateDeValeur).subtract(2, 'years').format('YYYY');
    var januaryYearMoins2 = yearMoins2 + '-01';
    var rfr = situation.foyer_fiscal && situation.foyer_fiscal.rfr && situation.foyer_fiscal.rfr[yearMoins2];
    var hasYm2Ressources = situation.individus.some(function(individu) {
        return categoriesRnc.reduce(function(hasYm2RessourcesAccum, categorieRnc) {
            if (! individu[categorieRnc.id]) {
                return hasYm2RessourcesAccum;
            }

            return hasYm2RessourcesAccum ||
                typeof individu[categorieRnc.id][yearMoins2] == 'number' ||
                typeof individu[categorieRnc.id][januaryYearMoins2] == 'number';
        }, false);
    });
    return typeof rfr == 'number' || hasYm2Ressources;
}

function isNotValidValue(value) {
    return _.isNaN(value) || _.isUndefined(value) || value === null;
}

function buildOpenFiscaEntity(mesAidesEntity, mappingSchema, situation) {
    var result = _.cloneDeep(mesAidesEntity);
    _.forEach(mappingSchema, function(definition, openfiscaKey) {
        var params = _.isString(definition) ? { src: definition } : definition;

        result[openfiscaKey] = params.src ? params.fn(mesAidesEntity[params.src], mesAidesEntity, situation) : params.fn(mesAidesEntity, situation);

        // Remove null as OpenFisca do not handle them correctly
        if (isNotValidValue(result[openfiscaKey])) {
            if ('default' in params) result[openfiscaKey] = params.default;
            else delete result[openfiscaKey];
        }
    });
    return result;
}

function mapIndividus(situation) {
    var individus = _.filter(situation.individus, function(individu) {
        return common.isIndividuValid(individu, situation);
    });

    return _.map(individus, function(individu) {
        var openfiscaIndividu = buildOpenFiscaEntity(individu, schema.individu, situation);
        applyRessources(individu, openfiscaIndividu, ressources.individu);

        if (! ressourcesYearMoins2Captured(situation)) {
            duplicateRessourcesForAnneeFiscaleDeReference(openfiscaIndividu, situation.dateDeValeur);
        }

        var propertiesToDelete = [
            'firstName',
            'nationalite',
            'role',
            'salaire_net_hors_revenus_exceptionnels',
            'specificSituations',
            'tauxIncapacite',
        ];
        propertiesToDelete.forEach(function(propertyName) {
            delete openfiscaIndividu[propertyName];
        });

        return openfiscaIndividu;
    });
}

function buildOpenFiscaTestCase(situation) {
    var familles = [ situation.famille ];
    var individus = mapIndividus(situation);
    allocateIndividualsToEntities(situation);

    delete situation.menage.nom_commune;
    delete situation.menage.code_postal;

    var testCase = {
        individus: individus,
        familles: familles,
        foyers_fiscaux: [ situation.foyer_fiscal ],
        menages: [ situation.menage ],
    };
    propertyMove.movePropertyValuesToGroupEntity(testCase);
    setNonInjectedPrestationsToZero(familles, individus, situation.dateDeValeur);
    copyTo3PreviousMonths(testCase, situation.dateDeValeur);

    return testCase;
}

exports.buildOpenFiscaRequest = function(sourceSituation) {
    var situation = sourceSituation.toObject ? sourceSituation.toObject() : _.cloneDeep(sourceSituation);

    return {
        //intermediate_variables: true,
        labels: true,
        scenarios: [{
            test_case: buildOpenFiscaTestCase(situation),
            period: 'month:' + moment(sourceSituation.dateDeValeur).format('YYYY-MM'),
        }],
        variables: _.keys(common.requestedVariables).sort(),
    };
};
