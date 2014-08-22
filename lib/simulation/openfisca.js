/*
** Module dependencies
*/
var request = require('superagent');
var _ = require('lodash');
var util = require('util');
var config = require('../config/config');
var debug = require('debug')('openfisca');
var moment = require('moment');

var prestations = {
    aspa: Number,
    acs: Number,
    cmu_c: Boolean,
    apl: Number,
    als: Number,
    alf: Number,
    af: Number,
    rsa: Number,
    asf: Number,
    cf: Number
};

function troisDerniersMois() {
    return _.map([3, 2, 1], function(nbMonths) {
        return moment().subtract(moment.duration(nbMonths, 'months')).format('YYYY-MM');
    });
}

function mapActivity(person, key, openfiscaObj, code) {
    var activity = person[key];
    if (activity) openfiscaObj.activite = code;
}

var statutMaritalMap = {
    'seul': 2,
    'mariage': 1,
    'pacs': 5,
    'relation_libre': 2
};

var ressourcesMap = {
    sali: [
        'revenusSalarie',
        'revenusNonSalarie',
        'revenusAutoEntrepreneur',
        'indJourMaternite',
        'indJourPaternite',
        'indJourAdoption',
        'indJourMaladie',
        'indJourMaladieProf',
        'indJourAccidentDuTravail'
    ],
    choi: [
        'allocationsChomage',
        'indChomagePartiel'
    ],
    alr: ['pensionsAlimentaires'],
    rsti: ['pensionsRetraitesRentes']
};

function mapIndividus(situation) {
    return _.map(situation.individus, function(individu) {
        var target = { id: individu._id };

        var dateDeNaissance = individu.dateDeNaissance;
        if (!dateDeNaissance) {
            throw new Error('L\'individu de role "' + individu.role + '" n\'a pas de date de naissance renseignée');
        }
        target.birth = moment(dateDeNaissance).format('YYYY-MM-DD');

        var statutMarital = individu.statutMarital;
        if (statutMarital) {
            target.statmarit = statutMaritalMap[statutMarital];
        }

        // mapActivity(individu, ACTIF_OCCUPÉ, target, 0);
        mapActivity(individu, 'demandeurEmploi', target, 1);
        mapActivity(individu, 'etudiant', target, 2);
        mapActivity(individu, 'retraite', target, 3);

        var periodes = troisDerniersMois();
        var ressources = _.filter(individu.ressources, function(ressource) {
            return _.contains(periodes, ressource.periode);
        });
        var rs = {};
        ressources.forEach(function(ressource) {
            if (_.isNumber(rs[ressource.type])) {
                rs[ressource.type] += ressource.montant;
            } else {
                rs[ressource.type] = ressource.montant;
            }
        });

        _.forEach(ressourcesMap, function(ressourcesList, key) {
            var sum = 0;
            ressourcesList.forEach(function(ressource) {
                if (_.isNumber(rs[ressource])) sum += rs[ressource];
            });
            target[key] = 4 * sum;
        });

        return target;
    });
}

var statusOccupationMap = {
    'proprietaireprimoaccedant': 1,
    'proprietaire': 2,
    'locatairehlm': 3,
    'locatairenonmeuble': 4,
    'locatairemeublehotel': 5,
    'gratuit': 6,
    'homeless': 0 // TODO
};

function mapLogement(logement, menage) {
    var type = logement.type;
    if (type) {
        var statusOccupationId = type;
        if (logement.primoAccedant) statusOccupationId += 'primoaccedant';
        if (logement.locationType) statusOccupationId += logement.locationType;
        menage.so = statusOccupationMap[statusOccupationId];
    }
    if (logement.loyer) {
        menage.loyer = logement.loyer;
    }
    if (logement.adresse && logement.adresse.codePostal) {
        menage.code_postal = parseInt(logement.adresse.codePostal);
    }
    if (logement.membreFamilleProprietaire) {
        menage.proprietaire_proche_famille = true;
    }
}

function mapMenages(situation) {
    var demandeur = _.find(situation.individus, {role: 'demandeur'});
    var conjoint = _.find(situation.individus, {role: 'conjoint'});
    var menage = { personne_de_reference: demandeur._id };
    if (conjoint) {
        menage.conjoint = conjoint._id;
    }
    menage.enfants = _.pluck(_.filter(situation.individus, {role: 'enfant'}), '_id');
    mapLogement(situation.logement, menage);

    return [menage];
}

function mapFamilles(situation) {
    var parents = _.pluck(_.filter(situation.individus, function(individu) {
        return _.contains(['demandeur', 'conjoint'], individu.role);
    }), '_id');

    var enfants = _.pluck(_.filter(situation.individus, {role: 'enfant'}), '_id');

    return [{ parents: parents, enfants: enfants }];
}

function mapFoyersFiscaux(situation) {
    var declarants = _.filter(situation.individus, function(individu) {
        return _.contains(['demandeur', 'conjoint'], individu.role);
    });

    declarants.forEach(function(declarant) {
        if (!declarant.dateDeNaissance || moment().diff(moment(declarant.dateDeNaissance), 'years') < 18)
            throw new Error('Le déclarant de role "' + declarant.role + '" a moins de 18 ans');
    });

    return [{
        declarants: _.pluck(declarants, '_id'),
        personnes_a_charge: _.pluck(_.filter(situation.individus, {role: 'enfant'}), '_id')
    }];
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
            date: moment().format('YYYY-MM-DD')
        }],
        variables: _.keys(prestations)
    };
}

function calculate(situation, callback) {
    try {
        request
            .post(config.openfiscaApi + '/api/1/calculate')
            .send(buildRequest(situation))
            .end(function(err, response) {
                if (err) return callback(err);
                if (response.error) {
                    console.log('Response body: ', util.inspect(response.body, { showHidden: true, depth: null }));
                    return callback({ apiError: 'Communication error with OpenFisca' });
                }

                callback(null, response.body);
            });
    } catch(err) {
        callback(err);
    }
}

function simulate(situation, callback) {
    calculate(situation, function(err, response) {
        if (err)  return callback(err);

        var result = _.mapValues(prestations, function(type, name) {
            var value = response.value[0].familles[0][name];
            if (type === Number) return Math.round((value / 12) * 100) / 100;
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
exports.mapIndividus = mapIndividus;
exports.mapFamilles = mapFamilles;
exports.mapMenages = mapMenages;
exports.mapLogement = mapLogement;
exports.mapFoyersFiscaux = mapFoyersFiscaux;
exports.calculate = calculate;
exports.simulate = simulate;
exports.buildRequest = buildRequest;
exports.ping = ping;
