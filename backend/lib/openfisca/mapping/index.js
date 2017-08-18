var moment = require('moment');
var _ = require('lodash');

var common = require('./common');
var buildOpenFiscaIndividu = require('./individu');

var propertyMove = require('./propertyMove');
var last3MonthsDuplication = require('./last3MonthsDuplication');

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
            entity[prestationName] = entity[prestationName] || {};
            _.forEach(common.getPeriods(dateDeValeur).last12Months, function(period) {
                entity[prestationName][period] = entity[prestationName][period] || 0;
            });
        });
    });
}



function mapIndividus(situation) {
    var individus = _.filter(situation.individus, function(individu) {
        return common.isIndividuValid(individu, situation);
    });

    return _.map(individus, function(individu) {
        return buildOpenFiscaIndividu(individu, situation);
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

    last3MonthsDuplication(testCase, situation.dateDeValeur);

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
