var _ = require('lodash');

var common = require('./common');
var buildOpenFiscaIndividu = require('./individu');
var migrations = require('../../migrations');

var propertyMove = require('./propertyMove');
var last3MonthsDuplication = require('./last3MonthsDuplication');

function allocateIndividualsToEntities(situation) {
    var famille = situation.famille;
    var foyer = situation.foyer_fiscal;
    var menage = situation.menage;

    var demandeur = common.getDemandeur(situation);
    var demandeurId = demandeur && demandeur.id;
    if (demandeurId) {
        famille.parents = [ demandeurId ];
        foyer.declarants = [ demandeurId ];
        menage.personne_de_reference = [ demandeurId ];
    }

    var conjoint = common.getConjoint(situation);
    var conjointId = conjoint && conjoint.id;
    if (conjointId) {
        famille.parents.push(conjointId);
        foyer.declarants.push(conjointId);
        menage.conjoint = [ conjointId ];
    }

    var enfants = common.getEnfants(situation);
    var validEnfants = _.filter(enfants, function(enfant) { return common.isIndividuValid(enfant, situation); });
    var enfantIds = validEnfants.map(function(enfant) { return enfant.id; });
    famille.enfants = enfantIds;
    foyer.personnes_a_charge = enfantIds;
    menage.enfants = enfantIds;
}

function setNonInjectedPrestations(testCase, periods, value) {
    var prestationsFinancieres = _.pickBy(common.requestedVariables, function(definition) {
        return ((! definition.type) || definition.type === 'float');
    });

    _.forEach(prestationsFinancieres, function(definition, prestationName) {
        _.forEach(testCase[definition.entity], function(entity) {
            entity[prestationName] = entity[prestationName] || {};
            _.forEach(periods, function(period) {
                if (value === undefined) {
                    delete entity[prestationName][period];
                } else {
                    entity[prestationName][period] = entity[prestationName][period] || value;
                }
            });
        });
    });
}
exports.setNonInjectedPrestations = setNonInjectedPrestations;


function mapIndividus(situation) {
    var individus = _.filter(common.getIndividusSortedParentsFirst(situation), function(individu) {
        return common.isIndividuValid(individu, situation);
    });

    return _.map(individus, function(individu) {
        return buildOpenFiscaIndividu(individu, situation);
    }).reduce(function(accum, individu) {
        accum[individu.id] = individu;
        delete individu.id;
        return accum;
    }, {});
}

function giveValueToRequestedVariables(testCase, periods, value) {
    if (! (periods instanceof Array)) {
        periods = [periods];
    }

    _.forEach(common.requestedVariables, function(definition, prestationName) {
        _.forEach(testCase[definition.entity], function(entity) {
            entity[prestationName] = entity[prestationName] || {};
            _.forEach(periods, function(period) {
                if (typeof entity[prestationName][period] !== 'undefined' && entity[prestationName][period] !== null) {
                    return;
                }
                if (value === undefined) {
                    delete entity[prestationName][period];
                } else {
                    entity[prestationName][period] = value;
                }
            });
        });
    });
}
exports.giveValueToRequestedVariables = giveValueToRequestedVariables;

// Use heuristics to pass functional tests
// Complexity may be added in the future in the application (new questions to ask)
// So far, due to a bug or some ambiguity
// cf. https://github.com/openfisca/openfisca-france/pull/1233
// logement_conventionne needs to be true when the loan in fully paid
// to avoid a benefit from appearing
function applyHeuristicsAndFix(testCase, dateDeValeur) {
    var thisMonth = common.getPeriods(dateDeValeur).thisMonth;

    var menage = _.assign({}, {
        logement_conventionne: {}
    }, testCase.menages._);
    menage.logement_conventionne[thisMonth] = menage.statut_occupation_logement && menage.statut_occupation_logement[thisMonth] == 'primo_accedant' && menage.loyer && menage.loyer[thisMonth] == 0;

    testCase.menages._ = menage;
    return testCase;
}

exports.buildOpenFiscaRequest = function(sourceSituation) {
    var situation = sourceSituation.toObject ? migrations.apply(sourceSituation).toObject() : _.cloneDeep(sourceSituation);

    var individus = mapIndividus(situation);
    allocateIndividualsToEntities(situation);

    delete situation.menage.nom_commune;
    delete situation.menage.code_postal;

    var testCase = {
        individus: individus,
        familles: {
            _: situation.famille
        },
        foyers_fiscaux: {
            _: situation.foyer_fiscal
        },
        menages: {
            _: situation.menage
        },
    };

    propertyMove.movePropertyValuesToGroupEntity(testCase);

    var periods = common.getPeriods(situation.dateDeValeur);
    setNonInjectedPrestations(testCase, _.difference(periods.last12Months, periods.last3Months), 0);
    last3MonthsDuplication(testCase, situation.dateDeValeur);
    giveValueToRequestedVariables(testCase, periods.thisMonth, null);

    return applyHeuristicsAndFix(testCase, sourceSituation.dateDeValeur);
};
