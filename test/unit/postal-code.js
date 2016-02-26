import expect from 'expect.js';

import store from '../../front/store';
import { parseResponse, update } from '../../front/questions/postal-code';
import * as mock from '../mock/codes-postaux';

describe('Postal code question', () => {
    describe('response parser', () => {
        function shouldRejectWithError(promise, id, done) {
            return promise
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
                shouldRejectWithError(mock.fetchWithNoMatch(), 'invalid', done);
            });
        });

        describe('with an invalid input', () => {
            it('should raise en exception', done => {
                shouldRejectWithError(mock.fetchWithInvalidInput(), 'invalid', done);
            });
        });

        describe('with a network error', () => {
            it('should raise en exception', done => {
                shouldRejectWithError(mock.fetchWithNetworkError(), 'communication', done);
            });
        });

        describe('with a single match', () => {
            it('should parse it', done => {
                mock.fetchWithSingleMatch()
                    .then(parseResponse)
                    .then(result => {
                        expect(result).to.have.length(1);
                        expect(result[0].codeInsee).to.be(mock.SINGLE_MATCH_INSEE_CODE);
                    }).then(done, done);
            });
        });

        describe('with multiple matches', () => {
            it('should parse them', done => {
                mock.fetchWithMultipleMatches()
                    .then(parseResponse)
                    .then(result => {
                        expect(result).to.be(mock.MULTIPLE_MATCHES);
                    }).then(done, done);
            });
        });
    });

    describe('state modification', function() {
        let state,
            value;

        function setValue(newValue) {
            return () => value = newValue;
        }

        beforeEach(done => {
            store.dispatch(update('postalCode', value))
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

        describe('with a string value', () => {
            before(setValue('not a postal code'));

            it('should have an "invalid" error', () => {
                expect(state.error).to.be.ok();
                expect(state.error.id).to.be('invalid');
            });
        });

        describe('with a single match', () => {
            before(setValue(mock.SINGLE_MATCH_POSTAL_CODE));

            it('should update the OpenFisca situation', () => {
                expect(state.openfiscaSituation.menages[0].depcom).to.be(mock.SINGLE_MATCH_INSEE_CODE);
            });

            it('should have no error', () => {
                expect(state.error).to.not.be.ok();
            });
        });

        describe('with no match', () => {
            before(setValue(mock.NO_MATCH_POSTAL_CODE));

            it('should clean the OpenFisca situation', () => {
                expect(state.openfiscaSituation.menages[0].depcom).to.not.be.ok();
            });

            it('should show an error', () => {
                expect(state.error).to.be.ok();
            });
        });

        describe('with multiple matches', () => {
            before(setValue(mock.MULTIPLE_MATCHES_POSTAL_CODE));

            it('should clean the OpenFisca situation', () => {
                expect(state.openfiscaSituation.menages[0].depcom).to.not.be.ok();
            });

            it('should add suggestions', () => {
                expect(state.suggestions).to.eql(mock.MULTIPLE_MATCHES);
            });

            it('should have no error', () => {
                expect(state.error).to.not.be.ok();
            });
        });
    });

});
