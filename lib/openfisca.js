var request = require('superagent');
var Q = require('q');
var _ = require('lodash');
var util = require('util');

var statmatMap = {
    'célibataire': 2,
    'en couple': 2, // N'existe pas dans OpenFisca
    'pacsé(e)': 5,
    'marié(e)': 1,
    'divorcé(e)': 3,
    'séparé(e)': 1, // N'existe pas dans OpenFisca
    'veuf/veuve': 4 // Jeune veuf = 6
};

var soMap = {
    'locataire': 4, // HLM = 3, Meublé et hôtel = 5
    'propriétaire': 2, // Accédant = 1
    'occupant à titre gratuit': 6,
    'sans domicile fixe': 0
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

exports.simulate = function(situation) {
    var dfd = Q.defer();

    var firstPerson = {
        activite: activiteMap[situation['demandeur.situationPro']],
        birth: situation['demandeur.dateDeNaissance'],
        id: 'ind0',
        sali: situation['demandeur.salaire3DerniersMois'] * 12,
        statmarit: statmatMap[situation['demandeur.situationFamiliale']]
    };
    var secondPerson = _.clone(firstPerson);
    secondPerson.id = 'ind1';
    secondPerson.sali = 0;

    var individus = [firstPerson];
    if (_.contains(['en couple', 'marié(e)', 'pacsé(e)'], situation['demandeur.situationFamiliale'])) {
        individus.push(secondPerson);
    }

    var menage = {
        personne_de_reference: 'ind0',
        so: soMap[situation['demandeur.situationLogement']],
        loyer: parseInt(situation['logement.loyer'])
    };
    if (_.contains(['en couple', 'marié(e)', 'pacsé(e)'], situation['demandeur.situationFamiliale'])) menage.conjoint = 'ind1';

    var famille = { parents: _.pluck(individus, 'id') };

    var foyersFiscaux = [];
    if (!situation['demandeur.mineur']) {
        if (_.contains(['célibataire', 'séparé(e)', 'veuf/veuve', 'divorcé(e)'], situation['demandeur.situationFamiliale'])) {
            foyersFiscaux.push({ declarants: ['ind0'] });
        } else if (situation['demandeur.situationFamiliale'] === 'en couple') {
            foyersFiscaux.push({ declarants: ['ind0'] }, { declarants: ['ind1'] });
        } else {
            foyersFiscaux.push({ declarants: ['ind0', 'ind1'] });
        }
    }

    var scenario = {
        test_case: {
            familles: [famille],
            foyers_fiscaux: foyersFiscaux,
            individus: individus,
            menages: [menage]
        },
        legislation_url: 'http://api.openfisca.fr/api/1/default-legislation',
        year: 2013
    };

    console.log(util.inspect(scenario.test_case, { showHidden: true, depth: null }));

    request
        .post('http://api.openfisca.fr/api/1/simulate')
        .send({ scenarios: [scenario] })
        .end(function(err, response) {
            if (err) return dfd.reject(err);
            console.log(util.inspect(response.body, { showHidden: true, depth: null }));
            if (response.error) return dfd.reject({ apiError: 'Communication error with OpenFisca' });

            var data = response.body.value;
            var result = {};
            // TODO: rewrite
            result.ASPA = Math.round(data.children[2].children[1].children[0].values[0] / 12);
            result.APL = Math.round(data.children[2].children[2].children[0].values[0] / 12);
            result.ALS = Math.round(data.children[2].children[2].children[1].values[0] / 12);
            result.RSA = Math.round(data.children[2].children[1].children[4].values[0] / 12);
            dfd.resolve(result);
        });

    return dfd.promise;
};
