import expect from 'expect.js';

import store from '../../front/store';
import { parseResponse, update } from '../../front/questions/postal-code';
import * as mock from '../mock/codes-postaux';

describe('Postal code question', () => {
    before(mock.start);
    after(mock.stop);

    describe('response parser', () => {
        function shouldRejectWithError(postalCode, id, done) {
            return fetch(`https://apicarto.sgmap.fr/codes-postaux/communes/${postalCode}`)
                .then(parseResponse, parseResponse)
                .then(
                    () => new Error('should have been rejected'),
                    error => {
                        expect(error.id).to.be(id);
                    }
                ).then(done, done);
        }

        describe('with no match', () => {
            it('should raise en exception', done => {
                shouldRejectWithError(mock.NO_MATCH_POSTAL_CODE, 'invalid', done);
            });
        });

        describe('with an invalid input', () => {
            it('should raise en exception', done => {
                shouldRejectWithError('not a postal code', 'invalid', done);
            });
        });

        describe('with a network error', () => {
            it('should raise en exception', done => {
                shouldRejectWithError('down', 'communication', done);
            });
        });

        describe('with a single match', () => {
            it('should parse it', done => {
                fetch(`https://apicarto.sgmap.fr/codes-postaux/communes/${mock.SINGLE_MATCH_POSTAL_CODE}`)
                    .then(parseResponse)
                    .then(result => {
                        expect(result).to.have.length(1);
                        expect(result[0].codeInsee).to.be(mock.SINGLE_MATCH_INSEE_CODE);
                    }).then(done, done);
            });
        });

        describe('with multiple matches', () => {
            it('should parse them', done => {
                fetch(`https://apicarto.sgmap.fr/codes-postaux/communes/${mock.MULTIPLE_MATCHES_POSTAL_CODE}`)
                    .then(parseResponse)
                    .then(result => {
                        expect(result).to.eql(mock.MULTIPLE_MATCHES);
                    }).then(done, done);
            });
        });
    });

    describe('state modification', function() {
        let state,
            value,
            codeInsee;

        function setValue(newValue) {
            return () => value = newValue;
        }

        function codeInseeSetterMock(commune) {
            codeInsee = commune.codeInsee;
        }

        beforeEach(done => {
            store.dispatch(update('postalCode', value, codeInseeSetterMock))
                .then(() => {
                    state = store.getState();
                    done();
                }, done);
        });

        describe('with no value', () => {
            before(setValue(''));

            it('should have an error', () => {
                expect(state.error).to.be.ok();
                // don't test it is a "required" error as this has been caught by earlier validation
            });
        });

        describe('with multiple matches', () => {
            before(setValue(mock.MULTIPLE_MATCHES_POSTAL_CODE));

            it('should select the first match', () => {
                expect(codeInsee).to.be(mock.MULTIPLE_MATCHES[0].codeInsee);
            });

            it('should add suggestions', () => {
                expect(state.suggestions).to.eql(mock.MULTIPLE_MATCHES);
            });

            it('should have no error', () => {
                expect(state.error).to.not.be.ok();
            });
        });

        describe('with an alphabetic value', () => {
            before(setValue('not a postal code'));

            it('should have an "invalid" error', () => {
                expect(state.error).to.be.ok();
                expect(state.error.id).to.be('invalid');
            });
        });

        describe('with a single match', () => {
            before(setValue(mock.SINGLE_MATCH_POSTAL_CODE));

            it('should update the OpenFisca situation', () => {
                expect(codeInsee).to.be(mock.SINGLE_MATCH_INSEE_CODE);
            });

            it('should clean suggestions', () => {
                expect(state.suggestions).to.be.empty();
            });

            it('should have no error', () => {
                expect(state.error).to.not.be.ok();
            });
        });

        describe('with no match', () => {
            before(setValue(mock.NO_MATCH_POSTAL_CODE));

            it('should clean the OpenFisca situation', () => {
                expect(codeInsee).to.not.be.ok();
            });

            it('should clean suggestions', () => {
                expect(state.suggestions).to.be.empty();
            });

            it('should show an error', () => {
                expect(state.error).to.be.ok();
            });
        });
    });
});
