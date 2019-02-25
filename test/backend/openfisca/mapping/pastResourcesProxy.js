var subject = require('../../../../backend/lib/openfisca/mapping/individu/pastResourcesProxy');
var expect = require('expect');

describe('openfisca past resource proxy', function() {
    var date = new Date('2019-02-14');

    describe('proxyWithCurrentResources', function() {

        describe('situation with 12 month rolling data', function() {
            var individu = {
                salaire_net: {
                    '2019-01': 1200,
                }
            };

            beforeEach(function() {
                subject.proxyWithCurrentResources(individu, date);
            })

            it('populates current fiscal year', function() {
                expect(individu.salaire_net['2017-01']).toEqual(100);
            });

            it('populates the previous fiscal year', function() {
                expect(individu.salaire_net['2016-01']).toEqual(100);
            });
        });
    });
});
