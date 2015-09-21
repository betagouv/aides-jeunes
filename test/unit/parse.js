import expect from 'expect.js';

import AIDES from '../../config/aides';
import {
    alreadyHasAide,
    reverseMap,
} from '../../openfisca/parse';


describe('parse', () => {
    const OPENFISCA_RESPONSE = require('../data/openfisca-response.json'),
          SITUATION = require('../data/situation.json');

    describe('reverseMap', () => {
        let subject;

        before(() => {
            subject = reverseMap(OPENFISCA_RESPONSE, SITUATION);
        });

        it('should give expected aides', () => {
            expect(subject).to.only.have.keys([ 'af', 'cmu_c', 'paje_base', 'rsa' ]);
        });

        it('should give expected amounts', () => {
            expect(subject.cmu_c).to.be.ok();
            // avoid being too specific on amounts to ease updates
            expect(subject.af).to.be.within(129, 130);
            expect(subject.paje_base).to.be.within(93, 94);
            expect(subject.rsa).to.be.within(877, 878);
        });
    });

    describe('alreadyHasAide', () => {
        const SITUATION_WITH_AIDE = require('../data/situation-with-aspa.json');

        it('should ignore aides that are set to 0 in a situation', () => {
            for (let aideId in AIDES)
                expect(alreadyHasAide(aideId, SITUATION)).to.not.be.ok();
        });

        it('should extract aides that are not set to 0 from a situation', () => {
            expect(alreadyHasAide('aspa', SITUATION_WITH_AIDE)).to.be.ok();
        });
    });
});
