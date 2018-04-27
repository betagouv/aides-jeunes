var subject = require('../../../backend/lib/ludwig/extractResults');
var expect = require('expect');
var moment = require('moment');

var dateDeValeur = moment('2017-06-01');
var response = {
    familles: {
        _: {
            rsa: {
                '2017-05': 0,
                '2017-06': 100
            },
            rsa_non_calculable: {
                '2017-06': ''
            }
        }
    },
    individus: {
        demandeur: {
            aah: {
                '2017-04': 800,
                '2017-05': 800,
                '2017-06': 800
            },
            aah_non_calculable: {
                '2017-06': 'intervention_CDAPH_necessaire'
            },
            aide_logement: {
                '2017-04': 800,
                '2017-05': 800,
                '2017-06': 800
            },
            aide_logement_non_calculable: {
                '2017-06': 'locataire_foyer'
            },
        }
    },
    menages: {
        _: {
            personne_de_reference: ['demandeur']
        }
    }
};

describe('ludwig extractResults', function() {
    var result = subject(response, dateDeValeur);

    it('capture provided value', function() {
        expect(result.rsa).toEqual(100);
    });

    it('captures non_calculable variable and reason', function() {
        expect(result.aide_logement).toEqual('locataire_foyer');
    });
});
