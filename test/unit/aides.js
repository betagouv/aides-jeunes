import expect from 'expect.js';

import AIDES from '../../config/aides';


describe('aides', function() {
    it('should export an object', () => {
        expect(AIDES).to.be.an('object');
    });

    it('should be unmutable', () => {
        expect(() => { AIDES.test = 'test' }).to.throwException();
    });
});
