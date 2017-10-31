/* 1 */
var response = {
    "familles": {
        _: {
            "rsa": {
                "2017-05": 0,
                "2017-06": 100
            },
            "rsa_non_calculable": {
                "2017-06": ""
            }
        }
    },
    "individus": {
        demandeur: {
            "aah": {
                "2017-04": 800,
                "2017-05": 800,
                "2017-06": 800
            },
            "aah_non_calculable": {
                "2017-06": "intervention_CDAPH_necessaire"
            },
        }
    }
};

var subject = require('../../../backend/lib/ludwig/extractResults');
var expect = require('expect');
var moment = require('moment');

describe('openfisca generateYAMLTest', function() {
    var result = subject(response, moment('2017-06-01'));

    it('capture provided value', function() {
        expect(result.rsa).toEqual(100);
    });

    it('captures non_calculable is provided', function() {
        expect(result.aah).toEqual('intervention_CDAPH_necessaire');
    });
});
