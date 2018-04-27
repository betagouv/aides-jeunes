var details = {
    name: 'Ideal name',
    description: 'Thorough description',
    output_variables: {
        valueOne: 1,
    },
    absolute_error_margin: 0.1,
};

var currentPeriod = '2018-01';
var situation = {
    dateDeValeur: new Date(currentPeriod),
    famille: {},
    foyer_fiscal: {},
    individus: [],
    menage: {
        personne_de_reference: ['id'],
        statut_occupation_logement: 'sans_domicile'
    },
};

var subject = require('../../../backend/lib/openfisca/test');
var expect = require('expect');

describe('openfisca generateTest', function() {
    var result = subject.generateTest(details, situation);

    it('does not add rsa_non_calculable', function() {
        expect(typeof result.familles[0].rsa_non_calculable[currentPeriod]).toBe('undefined');
    });
});

describe('openfisca generateYAMLTest', function() {
    var result = subject.generateYAMLTest(details, situation);

    it('generates a non empty string', function() {
        expect(result).toBeTruthy();
    });

    it('contains provided output_variables', function() {
        expect(result).toInclude('valueOne: 1');
    });
});
