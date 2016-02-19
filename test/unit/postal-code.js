import expect from 'expect.js';

import store from '../../front/store';
import { createAsyncStartAction } from '../../front/actions';
import { handleAPICall } from '../../front/questions/postal-code';
import * as mock from '../mock/codes-postaux';

describe('Postal code question', function() {
    let state,
        mockedFetch;

    beforeEach(done => {
        store.dispatch(createAsyncStartAction());
        handleAPICall(mockedFetch())
            .then(() => {
                state = store.getState();
                done();
            }, done);
    });

    describe('with a single match', () => {
        before(() => mockedFetch = mock.fetchWithSingleMatch);

        it('should not have an async action awaiting anymore', () => {
            expect(state.async).to.not.be.ok();
        });

        it('should update the OpenFisca situation', () => {
            expect(state.openfiscaSituation.menages[0].depcom).to.be(mock.SINGLE_MATCH_INSEE_CODE);
        });
    });

    describe('with multiple matches', () => {
        before(() => mockedFetch = mock.fetchWithMultipleMatches);

        it('should not have an async action awaiting anymore', () => {
            expect(state.async).to.not.be.ok();
        });
    });
});
