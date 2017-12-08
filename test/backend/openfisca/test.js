var situation = {
    famille: {},
    foyer_fiscal: {},
    individus: [],
    menage: {
        personne_de_reference: ['id'],
        statut_occupation_logement: 'Sans domicile stable'
    },
};

var subject = require('../../../backend/lib/openfisca/test');
var expect = require('expect');

describe('openfisca generateYAMLTest', function() {
    var details = {
        name: 'Ideal name',
        description: 'Thorough description',
        output_variables: {
            valueOne: 1,
        },
        absolute_error_margin: 0.1,
    };
    var result = subject.generateYAMLTest(details, situation);

    it('generates a non empty string', function() {
        expect(result).toBeTruthy();
    });

    it('contains provided output_variables', function() {
        expect(result).toInclude('valueOne: 1');
    });
});
