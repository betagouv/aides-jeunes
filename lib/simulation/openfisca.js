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
        openfiscaObj[openfiscaKey] += periodeRessource[resourceKey] * 4;
    });
}

function mapActivity(person, key, openfiscaObj, code) {
    var activity = person[key];
    if (activity) openfiscaObj.activite = code;
}

function mapIndividus(demandeur) {
    var individus = [demandeur];
    if (demandeur.conjoint) individus.push(demandeur.conjoint);
    if (demandeur.enfants) individus.concat(demandeur.enfants);

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

function buildRequest(demandeur) {
    return {
        scenarios: [{
            test_case: {
                familles: mapFamilles(demandeur),
                foyers_fiscaux: mapFoyersFiscaux(demandeur),
                individus: mapIndividus(demandeur),
                menages: mapMenages(demandeur)
            },
            legislation_url: OPENFISCA_API_URL + '/api/1/default-legislation',
            year: 2014
        }]
    };
}

function simulate(demandeur, callback) {
    request
        .post(OPENFISCA_API_URL + '/api/1/simulate')
        .send(buildRequest(demandeur))
        .end(function(err, response) {
            if (err) return callback(err);
            //console.log(util.inspect(response.body, { showHidden: true, depth: null }));
            if (response.error) {
                console.log('Response body: ', util.inspect(response.body, { showHidden: true, depth: null }));
                return callback({ apiError: 'Communication error with OpenFisca' });
            }

            var data = response.body.value;
            var result = {};
            // TODO: rewrite
            result.aspa = data.children[2].children[1].children[0].values[0] / 12;
            result.apl = data.children[2].children[2].children[0].values[0] / 12;
            result.als = data.children[2].children[2].children[1].values[0] / 12;
            result.alf = data.children[2].children[2].children[2].values[0] / 12;
            result.ale = data.children[2].children[2].children[3].values[0] / 12;
            result.rsa = data.children[2].children[1].children[4].values[0] / 12;
            callback(null, result);
        });
}

/*
** Exports
*/
exports.simulate = simulate;
exports.buildRequest = buildRequest;
