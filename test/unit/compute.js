import expect from 'expect.js';

import {
    wrap,
    compute,
} from '../../openfisca/compute';


describe('compute', function() {
    describe('wrap', () => {
        let subject;

        before(() => {
            subject = wrap({ test: true });
        });

        it('should wrap the situation without changing it', () => {
            expect(subject.scenarios[0].test_case.test).to.be(true);
        });

        it('should define the period', () => {
            expect(subject.scenarios[0].period).to.match(/^20(1[6-9]|2\d)-\d\d$/);
        });

        it('should define reforms', () => {
            expect(subject.base_reforms).to.be.an('array');
        });

        it('should define aides to be computed', () => {
            expect(subject.variables).to.be.an('array');
            expect(subject.variables).to.contain('aide_logement');
            expect(subject.variables.length).to.be.above(12);
        });

        it('should add computability requests to possibly uncomputable aides', () => {
            expect(subject.variables).to.contain('aide_logement_non_calculable');
        });
    });

    describe('compute', () => {
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
});
