var _ = require('lodash');

var common = require('./common');
var buildOpenFiscaIndividu = require('./individu');

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
        return (! definition.type) || definition.type === 'float';
    });

    _.forEach(prestationsFinancieres, function(definition, prestationName) {
        _.forEach(testCase[(definition.entity || 'famille') + 's'], function(entity) {
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
    var individus = _.filter(situation.individus, function(individu) {
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

exports.buildOpenFiscaRequest = function(sourceSituation) {
    var situation = sourceSituation.toObject ? sourceSituation.toObject() : _.cloneDeep(sourceSituation);

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

    var statuts_occupation_logement = {
        'Non renseigné': 'Non renseigné',
        'Accédant à la propriété': 'Accédant à la propriété',
        'Propriétaire (non accédant) du logement': 'Propriétaire (non accédant) du logement',
        'Locataire d‘un logement HLM': 'Locataire d\'un logement HLM',
        'Locataire ou sous-locataire d‘un logement loué vide non-HLM': 'Locataire ou sous-locataire d\'un logement loué vide non-HLM',
        'Locataire ou sous-locataire d‘un logement loué meublé ou d‘une chambre d‘hôtel': 'Locataire ou sous-locataire d\'un logement loué meublé ou d\'une chambre d\'hôtel',
        'Logé gratuitement par des parents, des amis ou l‘employeur': 'Logé gratuitement par des parents, des amis ou l\'employeur',
        'Locataire d‘un foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...)': 'Locataire d\'un foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...)',
        'Sans domicile stable': 'Sans domicile stable'
    };

    testCase.menages._.statut_occupation_logement = statuts_occupation_logement[testCase.menages._.statut_occupation_logement];

    propertyMove.movePropertyValuesToGroupEntity(testCase);

    var periods = common.getPeriods(situation.dateDeValeur);
    setNonInjectedPrestations(testCase, periods.last12Months, 0);

    last3MonthsDuplication(testCase, situation.dateDeValeur);

    _.forEach(common.requestedVariables, function(definition, prestationName) {
        _.forEach(testCase[(definition.entity || 'famille') + 's'], function(entity) {
            entity[prestationName] = entity[prestationName] || {};
            entity[prestationName][periods.thisMonth] = entity[prestationName][periods.thisMonth] || null;
        });
    });

    return testCase;
};
