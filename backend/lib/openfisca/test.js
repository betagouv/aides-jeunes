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

var TEST_ATTRIBUTES = [
    'name',
    'description',
    'output_variables',
    'absolute_error_margin',
    'relative_error_margin',
];

exports.generateYAMLTest = function generateYAMLTest(details, situation) {
    var openfiscaRequest = mapping.buildOpenFiscaRequest(situation.toObject ? situation.toObject() : situation);
    var testCase = {
        period: moment(situation.dateDeValeur).format('YYYY-MM'),
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

    var extensionSpecificSituation = prepareTestSituationForSpecificExtension(testCase, details.extension);
    var test = _.assign(_.pick(details, TEST_ATTRIBUTES), extensionSpecificSituation);
    return toYAML(test);
};
