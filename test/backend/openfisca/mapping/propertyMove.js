var subject = require('../../../../backend/lib/openfisca/mapping/propertyMove');
var expect = require('expect');

describe('openfisca mapping property move', function() {
    describe('movePropertyValuesToGroupEntity', function() {
        describe('situation with data', function() {
            var testCase = {
                individus: [{
                    id: 'bob',
                    aide_logement: {
                        '2015-01': 12,
                    },
                    rsa: {
                        '2015': 42,
                    },
                }],
                familles: [{
                    parents: ['bob'],
                    enfants: [],
                }],
                foyers_fiscaux: [],
            };

            it('moves across ressources', function() {
                subject.movePropertyValuesToGroupEntity(testCase);

                expect(testCase.familles[0].rsa).toBeTruthy();
                expect(testCase.familles[0].aide_logement).toBeTruthy();
                expect(testCase.individus[0].aide_logement).toBeFalsy();
            });
        });
        describe('situation without data', function() {
            var testCase = {
                individus: [],
                familles: [{}],
                foyers_fiscaux: [],
            };
            subject.movePropertyValuesToGroupEntity(testCase);

            it('runs completely', function() {
                expect(testCase.familles[0].rsa).toBeFalsy();
            });
        });
    });
});
