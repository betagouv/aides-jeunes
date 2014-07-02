/*
** Module dependencies
*/
var request = require('superagent');
var _ = require('lodash');
var util = require('util');
var prestations = require('./prestations');
var config = require('../config/config');
var debug = require('debug')('openfisca');

var statmatMap = {
    'seul': 2,
    'marié': 1,
    'pacsé': 5,
    'en couple': 2
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

function mapMenages(situation) {
    var logement = situation.logement;
    var menage = { personne_de_reference: situation.demandeur._id };
    if (logement.statusOccupation) menage.so = soMap[logement.statusOccupation];
    if (logement.loyer) menage.loyer = logement.loyer;
    if (logement.codePostal) menage.code_postal = logement.codePostal;
    if (situation.conjoint) menage.conjoint = situation.conjoint._id;
    if (situation.enfants) menage.enfants = _.pluck(situation.enfants, '_id');
    return [menage];
}

function mapFamilles(situation) {
    var parents = [situation.demandeur._id];
    if (situation.conjoint) parents.push(situation.conjoint._id);
    return [{ parents: parents, enfants: situation.enfants ? _.pluck(situation.enfants, 'id') : [] }];
}

function mapFoyersFiscaux(situation) {
    var declarants = [situation.demandeur._id];
    if (situation.conjoint) declarants.push(situation.conjoint._id);
    return [{ declarants: declarants, personnes_a_charge: situation.enfants ? _.pluck(situation.enfants, '_id') : [] }];
}

function buildRequest(situation) {
    return {
        intermediate_variables: true,
        scenarios: [{
            test_case: {
                familles: mapFamilles(situation),
                foyers_fiscaux: mapFoyersFiscaux(situation),
                individus: mapIndividus(situation),
                menages: mapMenages(situation)
            },
            year: 2014
        }],
        variables: _.keys(prestations)
    };
}

function calculate(situation, callback) {
    request
        .post(config.openfiscaApi + '/api/1/calculate')
        .send(buildRequest(situation))
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

function simulate(situation, callback) {
    calculate(situation, function(err, response) {
        if (err) return callback(err);
        var result = _.mapValues(prestations, function(def, name) {
            var value = response.value[0].familles[0][name];
            if (def.type === Number) return Math.round((value / 12) * 100) / 100;
            return value;
        });
        callback(null, result);
    });
}

function ping() {
    debug('PING?');
    request.get(config.openfiscaApi + '/api/1/fields').end(function(err, response) {
        if (err) return console.log('OpenFisca: Error: ' + err);
        if (response.error) return console.log('OpenFisca: Error: ' + response.status);
        debug('PONG!');
    });
}

/*
** Exports
*/
exports.calculate = calculate;
exports.simulate = simulate;
exports.buildRequest = buildRequest;
exports.ping = ping;
