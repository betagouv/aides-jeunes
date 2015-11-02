import expect from 'expect.js';

import compute from '../../openfisca/compute';


describe('compute', function() {
    const SITUATION = require('../mock/situation.json');

    let subject,
        openFiscaMock;

    before(() => {
        openFiscaMock = require('../mock/openfisca-superagent.js');
        subject = compute(SITUATION);
    });

    after(() => openFiscaMock.unset() );

    it('should return a promise', () => {
        expect(subject).to.be.a(Promise);
    });

    it('should fulfill it with the raw OpenFisca response', (done) => {
        subject.then((results) => {
            expect(results).to.be.an('object');
            expect(results.method).to.be('/api/1/calculate');
        }).then(done, done);
    });
});
