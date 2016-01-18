import expect from 'expect.js';

import {
    updateOpenfiscaSituation,
    notifyFetchResults,
    notifyGotResults,
} from '../../front/actions.js';
import {
    INITIAL_STATE,
    reducer,
} from '../../front/store.js';


describe('state handler', () => {
    const OPENFISCA_RESPONSE = require('../mock/openfisca-response.json');

    describe('initial state', () => {
        it('should be returned by default', () => {
            expect(reducer()).to.eql(INITIAL_STATE);
        });
    });

    describe('updateOpenfiscaSituation', () => {
        function update() {
            return reducer(INITIAL_STATE, updateOpenfiscaSituation({
                "individus": [
                    {
                        "salaire_net": {
                            "2013": 50000,
                        },
                    },
                ],
            }));
        }

        it('should return an updated state', () => {
            let actual = update();

            expect(actual.openfiscaSituation.individus[0].salaire_net['2013']).to.equal(50000);
        });

        it('should keep previous state intact', () => {
            let actual = update();

            expect(INITIAL_STATE.openfiscaSituation.individus[0].salaire_net['2013']).to.equal(40000);
        });
    });

    describe('notifyFetchResults', () => {
        it('should return an updated state', () => {
            let actual = reducer(INITIAL_STATE, notifyFetchResults());

            expect(actual.waitingForResults).to.be.ok();
        });

        it('should keep previous state intact', () => {
            let actual = reducer(INITIAL_STATE, notifyFetchResults());

            expect(INITIAL_STATE.waitingForResults).to.not.be.ok();
        });
    });

    describe('notifyGotResults', () => {
        it('should return an updated state', () => {
            let actual = reducer(INITIAL_STATE, notifyGotResults(OPENFISCA_RESPONSE));

            expect(actual.waitingForResults).to.not.be.ok();
            expect(actual.results).to.eql(OPENFISCA_RESPONSE);
        });

        it('should keep previous state intact', () => {
            let actual = reducer(INITIAL_STATE, notifyGotResults(OPENFISCA_RESPONSE));

            expect(INITIAL_STATE.results).to.not.be.ok();
        });
    });
});
