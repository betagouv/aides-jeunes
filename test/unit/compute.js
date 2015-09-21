import expect from 'expect.js';

import compute from '../../openfisca/compute';


describe('compute', function() {
    this.timeout(8000);  // OpenFisca is long to reply

    const SITUATION = require('../data/situation.json');

    let subject;

    before(() => {
        subject = compute(SITUATION);
    });

    it('should return a promise', () => {
        expect(subject).to.be.a(Promise);
    });

    it('should fulfill it with an object', (done) => {
        subject.then((results) => {
            expect(results).to.be.an('object');
            done();
        }, done);
    });
});
