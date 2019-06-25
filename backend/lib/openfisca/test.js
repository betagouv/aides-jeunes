var common = require('./mapping/common');
var mapping = require('./mapping');
var _ = require('lodash');

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
            'paris_energie_familles',
            'paris_logement_plfm',
            'paris_logement_aspeh',
            'paris_logement',
            'paris_logement_psol',
            'paris_forfait_familles',
            'paris_logement_familles',
        ],
        individus: [
            'paris_pass_access',
            'paris_pass_seniors',
        ],
    },
    'openfisca-rennesmetropole': {
        individus: [ 'rennes_metropole_transport' ],
    },
    'openfisca-france-local': {
        familles: [ 'alfortville_noel_enfants' ],
        individus: [
            'cotes_d_armor_fonds_solidarite_logement_energie_eligibilite',
            'garantie_jeunes'
        ]
    }
};

function prepareTestSituationForSpecificExtension(situation, extension) {
    _.forEach(EXTENSION_VARIABLES, function(specificVariables, extensionName) {
        if (extensionName == extension)
            return;

        _.forEach(specificVariables, function(fieldsToRemove, entityFieldName) {
            _.forEach(situation[entityFieldName], function(entity) {
                fieldsToRemove.forEach(function(fieldName) {
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
    'output',
    'absolute_error_margin',
    'relative_error_margin',
];

exports.generateTest = function generateYAMLTest(details, situation) {
    var openfiscaRequest = mapping.buildOpenFiscaRequest(situation.toObject ? situation.toObject() : situation);
    var periods = common.getPeriods(situation.dateDeValeur);
    var dropPeriods = [periods.thisMonth].concat(periods.last3Months);

    mapping.giveValueToRequestedVariables(openfiscaRequest, dropPeriods, undefined);
    var testInputs = prepareTestSituationForSpecificExtension(openfiscaRequest, details.extension);

    var testCase = {
        period: periods.thisMonth,
        input: testInputs
    };

    var result = _.assign(_.pick(details, TEST_ATTRIBUTES), testCase);
    return result;
};

exports.generateYAMLTest = function generateYAMLTest(details, situation) {
    return toYAML(exports.generateTest(details, situation));
};

exports.EXTENSION_VARIABLES = EXTENSION_VARIABLES;
