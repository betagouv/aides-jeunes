var mapping = require('./mapping');
var _ = require('lodash');
var moment = require('moment');

function toStringOf(obj) {
    return obj.toString();
}

var ID_PROPERTIES = {
    familles: ['enfants', 'parents'],
    foyers_fiscaux: ['declarants', 'personnes_a_charge'],
    individus: ['id'],
    menages: ['conjoint', 'enfants', 'personne_de_reference'],
};

function normalizeIDs(test) {
    Object.keys(ID_PROPERTIES).forEach(function(entity) {
        if (test[entity]) {
            _.forEach(test[entity], function(value, index) {
                _.forEach(ID_PROPERTIES[entity], function(property) {
                    if (test[entity][index][property] instanceof Array)
                        test[entity][index][property] = test[entity][index][property].map(toStringOf);
                    else if (test[entity][index][property])
                        test[entity][index][property] = test[entity][index][property].toString();
                });
            });
        }
    });
}

function toYAML(test) {
    normalizeIDs(test);
    return require('js-yaml').safeDump(test);
}

var EXTENSION_VARIABLES = {
    'openfisca-brestmetropole': {
        individus: [ 'brest_metropole_transport' ],
    },
    'openfisca-paris': {
        familles: [
            'parisien',
            'paris_complement_sante',
            'paris_energie_famille',
            'paris_logement_plfm',
            'paris_logement_aspeh',
            'paris_logement',
            'paris_logement_psol',
            'paris_forfait_famille',
            'paris_logement_familles',
        ],
    },
    'openfisca-rennesmetropole': {
        individus: [ 'rennes_metropole_transport' ],
    },
};

function prepareTestSituationForSpecificExtension(situation, extension) {
    _.forEach(EXTENSION_VARIABLES, function(specificVariables, extensionName) {
        if (extensionName == extension)
            return;

        _.forEach(specificVariables, function(fieldsToRemove, entityFieldName) {
            _.forEach(situation[entityFieldName], function(entity) {
                fieldsToRemove.forEach(function(fieldName) {
                    delete entity[fieldName];
                });
            });
        });
    });
    return situation;
}

var TEST_ATTRIBUTES = [
    'name',
    'description',
    'output_variables',
    'absolute_error_margin',
    'relative_error_margin',
];

exports.generateTest = function generateYAMLTest(details, situation) {
    var openfiscaRequest = mapping.buildOpenFiscaRequest(situation.toObject ? situation.toObject() : situation);

    var currentPeriod = moment(situation.dateDeValeur).format('YYYY-MM');

    var testCase = {
        period: currentPeriod,
        individus: _.map(openfiscaRequest.individus, function(value, key) {
            value.id = key;
            return value;
        }),
        familles: _.values(openfiscaRequest.familles),
        foyers_fiscaux: _.values(openfiscaRequest.foyers_fiscaux),
        menages: _.values(openfiscaRequest.menages).map(function(menage) {
            menage.personne_de_reference = menage.personne_de_reference[0];
            if (menage.conjoint) {
                menage.conjoint = menage.conjoint[0];
            }
            return menage;
        })
    };
    mapping.giveValueToRequestedVariables(testCase, currentPeriod, undefined);

    var extensionSpecificSituation = prepareTestSituationForSpecificExtension(testCase, details.extension);
    return _.assign(_.pick(details, TEST_ATTRIBUTES), extensionSpecificSituation);
};

exports.generateYAMLTest = function generateYAMLTest(details, situation) {
    return toYAML(exports.generateTest(details, situation));
};
