import expect from 'expect.js';

import compute from '../../openfisca/compute';


describe('compute', () => {
    it('should call back without error and with an object', (done) => {
        compute({}, (err, results) => {
            expect(err).to.be(undefined);
            expect(results).to.be.an('object');
            done();
        });
    });
});
