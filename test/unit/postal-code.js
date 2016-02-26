import expect from 'expect.js';

import store from '../../front/store';
import { createAsyncStartAction } from '../../front/actions';
import { parseResponse } from '../../front/questions/postal-code';
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
});
