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
    'single': 2,
    'married': 1,
    'civil union': 1,
    'cohabiting': 1
};

function addResourceTo(person, resourceKey, openfiscaObj, openfiscaKey) {
    var resource = person.read(resourceKey);
    if (!openfiscaObj[openfiscaKey]) openfiscaObj[openfiscaKey] = 0;
    if (_.isObject(resource)) {
        _.forEach(resource, function(m) {
            openfiscaObj[openfiscaKey] += m * 4;
        });
    }
}

function mapActivity(person, key, openfiscaObj, code) {
    var activity = person.read(key);
    if (activity) openfiscaObj.activite = code;
}

function mapPeople(situation) {
    return _.map(situation.people, function(person, id) {
        var resp = { id: id };
        var birthdate = person.read('birthdate');
        var activity = person.read('activity');
        var maritalStatus = person.read('maritalStatus');
        if (birthdate) resp.birth = birthdate.toString().substring(0, 10);
        if (activity) resp.activite = activiteMap[activity];
        if (maritalStatus) resp.statmarit = statmatMap[maritalStatus];

        mapActivity(person, 'demandeurEmploi', resp, 1);
        mapActivity(person, 'student', resp, 4);
        mapActivity(person, 'retired', resp, 3);

        addResourceTo(person, 'revenusSalarié', resp, 'sali');
        addResourceTo(person, 'revenusNonSalarié', resp, 'sali');
        addResourceTo(person, 'revenusAutoEntrepreneur', resp, 'sali');
        addResourceTo(person, 'allocationsChômage', resp, 'choi');
        addResourceTo(person, 'indChômagePartiel', resp, 'choi');
        addResourceTo(person, 'pensionsRetraitesRentes', resp, 'rsti');
        addResourceTo(person, 'pensionsAlimentaires', resp, 'alr');
        addResourceTo(person, 'ass', resp, 'ass');

        return resp;
    });
}

var soMap = {
    'tenant': 4, // HLM = 3, Meublé et hôtel = 5
    'owner': 2, // Accédant = 1
    'free occupant': 6,
    'homeless': 0
};

function mapHouseholds(situation) {
    var demandeur = situation.person('demandeur');
    var occupancyStatus = demandeur.read('occupancyStatus');
    var rent = demandeur.read('home') && situation.dwelling(demandeur.read('home')).read('rent');
    var postalCode = demandeur.read('home') && situation.dwelling(demandeur.read('home')).read('postalCode');
    var conjoint = demandeur.read('maritalPartner');
    var household = { personne_de_reference: 'demandeur' };
    if (occupancyStatus) household.so = soMap[occupancyStatus];
    if (rent) household.loyer = rent;
    if (postalCode) household.code_postal = postalCode;
    if (conjoint) household.conjoint = conjoint;
    if (demandeur.children) household.enfants = demandeur.children;
    return [household];
}

function mapFamilies(situation) {
    var demandeur = situation.person('demandeur');
    var conjoint = demandeur.read('maritalPartner');
    var parents = ['demandeur'];
    if (conjoint) parents.push(conjoint);
    return [{ parents: parents, enfants: demandeur.children }];
}

function mapIncomeSplittings(situation) {
    var demandeur = situation.person('demandeur');
    var is = [{ declarants: ['demandeur'], personnes_a_charge: demandeur.children }];
    var maritalStatus = demandeur.read('maritalStatus');
    if (!maritalStatus || maritalStatus === 'single') return is;
    if (maritalStatus === 'cohabiting') {
        is[1] = { declarants: [demandeur.read('maritalPartner')] };
    } else {
        is[0].declarants.push(demandeur.read('maritalPartner'));
    }
    return is;
}

function buildRequest(situation) {
    return {
        scenarios: [{
            test_case: {
                familles: mapFamilies(situation),
                foyers_fiscaux: mapIncomeSplittings(situation),
                individus: mapPeople(situation),
                menages: mapHouseholds(situation)
            },
            legislation_url: OPENFISCA_API_URL + '/api/1/default-legislation',
            year: 2014
        }]
    };
}

function simulate(situation, callback) {
    request
        .post(OPENFISCA_API_URL + '/api/1/simulate')
        .send(buildRequest(situation))
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
            result.ASPA = data.children[2].children[1].children[0].values[0] / 12;
            result.APL = data.children[2].children[2].children[0].values[0] / 12;
            result.ALS = data.children[2].children[2].children[1].values[0] / 12;
            result.ALF = data.children[2].children[2].children[2].values[0] / 12;
            result.ALE = data.children[2].children[2].children[3].values[0] / 12;
            result.RSA = data.children[2].children[1].children[4].values[0] / 12;
            callback(null, result);
        });
}

/*
** Exports
*/
exports.simulate = simulate;
exports.buildRequest = buildRequest;
