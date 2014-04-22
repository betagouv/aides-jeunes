var request = require('superagent');
var _ = require('lodash');
var util = require('util');

var OPENFISCA_API_URL = process.env.OPENFISCA_API_URL || 'http://api.openfisca.fr';

var statmatMap = {
    'single': 2,
    'married': 1,
    'civil union': 1,
    'cohabiting': 1
};

var activiteMap = {
    'salarié': 0,
    'travailleur non-salarié': 0,
    'demandeur d\'emploi': 1,
    'apprenti': 1,
    'conjoint collaborateur': 1,
    'retraité': 3,
    'étudiant, autre inactif': 4
};

function mapPeople(situation) {
    return _.map(situation.people, function(person, id) {
        var resp = { id: id };
        var birthdate = person.read('birthdate');
        var activity = person.read('activity');
        var income = person.read('income');
        var maritalStatus = person.read('maritalStatus');
        if (birthdate) resp.birth = birthdate.toString().substring(0, 10);
        if (activity) resp.activite = activiteMap[activity];
        if (income) resp.sali = income;
        if (maritalStatus) resp.statmarit = statmatMap[maritalStatus];
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
    var codePostal = demandeur.read('home') && situation.dwelling(demandeur.read('home')).read('codePostal');
    var conjoint = demandeur.read('maritalPartner');
    var household = { personne_de_reference: 'demandeur' };
    if (occupancyStatus) household.so = soMap[occupancyStatus];
    if (rent) household.loyer = rent;
    if (codePostal) household.code_postal = codePostal;
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

exports.simulate = function(situation, callback) {

    var scenario = {
        test_case: {
            familles: mapFamilies(situation),
            foyers_fiscaux: mapIncomeSplittings(situation),
            individus: mapPeople(situation),
            menages: mapHouseholds(situation)
        },
        legislation_url: OPENFISCA_API_URL + '/api/1/default-legislation',
        year: 2014
    };

    console.log(util.inspect(scenario.test_case, { showHidden: true, depth: null }));

    request
        .post(OPENFISCA_API_URL + '/api/1/simulate')
        .send({ scenarios: [scenario] })
        .end(function(err, response) {
            if (err) return callback(err);
            //console.log(util.inspect(response.body, { showHidden: true, depth: null }));
            if (response.error) return callback({ apiError: 'Communication error with OpenFisca' });

            var data = response.body.value;
            var result = {};
            // TODO: rewrite
            result.ASPA = Math.round(data.children[2].children[1].children[0].values[0] / 12);
            result.APL = Math.round(data.children[2].children[2].children[0].values[0] / 12);
            result.ALS = Math.round(data.children[2].children[2].children[1].values[0] / 12);
            result.ALF = Math.round(data.children[2].children[2].children[2].values[0] / 12);
            result.ALE = Math.round(data.children[2].children[2].children[3].values[0] / 12);
            result.RSA = Math.round(data.children[2].children[1].children[4].values[0] / 12);
            callback(null, result);
        });

};
