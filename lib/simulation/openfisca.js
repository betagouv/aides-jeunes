/*
** Module dependencies
*/
var request = require('superagent');
var _ = require('lodash');
var util = require('util');

/*
** Configuration
*/
var OPENFISCA_API_URL = process.env.OPENFISCA_API_URL || 'http://api.openfisca.fr';

var statmatMap = {
    'seul': 2,
    'marié': 1,
    'pacsé': 1,
    'en couple': 1
};

function ajouteRessourceType(individu, resourceKey, openfiscaObj, openfiscaKey) {
    var ressources = individu.ressourcesTroisDerniersMois();
    if (!openfiscaObj[openfiscaKey]) openfiscaObj[openfiscaKey] = 0;
    _.forEach(ressources, function(periodeRessource) {
        openfiscaObj[openfiscaKey] += periodeRessource[resourceKey] * 4 || 0;
    });
}

function mapActivity(person, key, openfiscaObj, code) {
    var activity = person[key];
    if (activity) openfiscaObj.activite = code;
}

function mapIndividus(demandeur) {
    var individus = [demandeur];
    if (demandeur.conjoint) individus.push(demandeur.conjoint);
    if (demandeur.enfants) individus = individus.concat(demandeur.enfants);

    return _.map(individus, function(individu) {
        var target = { id: individu.id };
        var dateDeNaissance = individu.dateDeNaissance;
        var statutMarital = individu.statutMarital;
        if (dateDeNaissance) target.birth = dateDeNaissance.toString().substring(0, 10);
        if (statutMarital) target.statmarit = statmatMap[statutMarital];

        // mapActivity(individu, ACTIF_OCCUPÉ, target, 0);
        mapActivity(individu, 'demandeurEmploi', target, 1);
        mapActivity(individu, 'etudiant', target, 2);
        mapActivity(individu, 'retraite', target, 3);

        ajouteRessourceType(individu, 'revenusSalarie', target, 'sali');
        ajouteRessourceType(individu, 'revenusNonSalarie', target, 'sali');
        ajouteRessourceType(individu, 'revenusAutoEntrepreneur', target, 'sali');
        ajouteRessourceType(individu, 'allocationsChomage', target, 'choi');
        ajouteRessourceType(individu, 'indChomagePartiel', target, 'choi');
        ajouteRessourceType(individu, 'pensionsRetraitesRentes', target, 'rsti');
        ajouteRessourceType(individu, 'pensionsAlimentaires', target, 'alr');
        ajouteRessourceType(individu, 'ass', target, 'ass');

        return target;
    });
}

var soMap = {
    'locataire': 4, // HLM = 3, Meublé et hôtel = 5
    'propriétaire': 2, // Accédant = 1
    'gratuit': 6,
    'homeless': 0 // TODO
};

function mapMenages(demandeur) {
    var logement = demandeur.logement;
    var targetMenage = { personne_de_reference: demandeur.id };
    if (logement.statusOccupation) targetMenage.so = soMap[logement.statusOccupation];
    if (logement.loyer) targetMenage.loyer = logement.loyer;
    if (logement.codePostal) targetMenage.code_postal = logement.codePostal;
    if (demandeur.conjoint) targetMenage.conjoint = demandeur.conjoint.id;
    if (demandeur.enfants) targetMenage.enfants = _.pluck(demandeur.enfants, 'id');
    return [targetMenage];
}

function mapFamilles(demandeur) {
    var parents = [demandeur.id];
    if (demandeur.conjoint) parents.push(demandeur.conjoint.id);
    return [{ parents: parents, enfants: demandeur.enfants ? _.pluck(demandeur.enfants, 'id') : [] }];
}

function mapFoyersFiscaux(demandeur) {
    var declarants = [demandeur.id];
    if (demandeur.conjoint) declarants.push(demandeur.conjoint.id);
    return [{ declarants: declarants, personnes_a_charge: demandeur.enfants ? _.pluck(demandeur.enfants, 'id') : [] }];
}

var variables = {
    aspa: {
        type: Number
    },
    acs: {
        type: Number
    },
    cmu_c: {
        type: Boolean
    },
    apl: {
        type: Number
    },
    als: {
        type: Number
    },
    alf: {
        type: Number
    },
    rsa: {
        type: Number
    }
};

function buildRequest(demandeur) {
    return {
        intermediate_variables: true,
        scenarios: [{
            test_case: {
                familles: mapFamilles(demandeur),
                foyers_fiscaux: mapFoyersFiscaux(demandeur),
                individus: mapIndividus(demandeur),
                menages: mapMenages(demandeur)
            },
            year: 2014
        }],
        variables: _.keys(variables)
    };
}

function calculate(demandeur, callback) {
    request
        .post(OPENFISCA_API_URL + '/api/1/calculate')
        .send(buildRequest(demandeur))
        .end(function(err, response) {
            if (err) return callback(err);
            //console.log(util.inspect(response.body, { showHidden: true, depth: null }));
            if (response.error) {
                console.log('Response body: ', util.inspect(response.body, { showHidden: true, depth: null }));
                return callback({ apiError: 'Communication error with OpenFisca' });
            }

            callback(null, response.body);
        });
}

function simulate(demandeur, callback) {
    calculate(demandeur, function(err, response) {
        if (err) return callback(err);
        var result = _.mapValues(variables, function(def, name) {
            var value = response.value[0].familles[0][name];
            if (def.type === Number) return value / 12;
            return value;
        });
        callback(null, result);
    });
}

/*
** Exports
*/
exports.calculate = calculate;
exports.simulate = simulate;
exports.buildRequest = buildRequest;
