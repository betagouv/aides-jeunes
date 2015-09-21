import expect from 'expect.js';

import AIDES from '../../config/aides';
import {
    getGivenAides,
    reverseMap,
    toOpenFiscaPeriod,
} from '../../openfisca/parse';


describe('parse', () => {
    const OPENFISCA_RESPONSE = require('../data/openfisca-response.json'),
          SITUATION = require('../data/situation.json'),
          SITUATION_WITH_AIDES = require('../data/situation-with-aspa.json');

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

    describe('getGivenAides', () => {
        it('should ignore aides that are set to 0 in a situation', () => {
            expect(getGivenAides(SITUATION)).to.eql([]);
        });

        it('should extract aides that are not set to 0 from a situation', () => {
            expect(getGivenAides(SITUATION_WITH_AIDES)).to.eql([ 'aspa' ]);
        });
    });

    describe('toOpenFiscaPeriod', () => {
        it('should format a date', () => {
            expect(toOpenFiscaPeriod(new Date('November 12, 2015'))).to.equal('2015-11');
        });

        it('should pad months', () => {
            expect(toOpenFiscaPeriod(new Date('January 2, 2015'))).to.equal('2015-01');
        });
    });
});
