var situation = {
    dateDeValeur: new Date('2017-10-02'),
    famille: {},
    foyer_fiscal: {},
    individus: [],
    menage: {
        personne_de_reference: ['id'],
        statut_occupation_logement: 'sans_domicile'
    },
};

var subject = require('../../../../backend/lib/openfisca/mapping');
var expect = require('expect');

describe('openfisca buildOpenFiscaRequest', function() {

    var result = subject.buildOpenFiscaRequest(situation);

    it('writes null for cmu_c in 2017-10', function() {
        expect(result.familles._.cmu_c['2017-10']).toBe(null);
    });
});
