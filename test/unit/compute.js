import expect from 'expect.js';

import compute from '../../openfisca/compute';


describe('compute', function() {
    this.timeout(8000);  // OpenFisca is long to reply

    const SITUATION = require('../assets/situation.json');

    it('should call back without error and with an object', (done) => {
        compute(SITUATION, (err, results) => {
            expect(err).to.not.be.ok();
            expect(results).to.be.an('object');
            done();
        });
    });
});
