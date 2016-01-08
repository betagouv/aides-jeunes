import expect from 'expect.js';

import {
    mesAides,
    updateOpenfiscaSituation,
    notifyFetchResults,
    notifyGotResults,
} from '../../front/app.js';


describe('state handler', () => {
    const OPENFISCA_RESPONSE = require('../mock/openfisca-response.json'),
          SITUATION = require('../mock/situation.json'),
          PREVIOUS_STATE = {
            openfiscaSituation: SITUATION,
          };


    describe('updateOpenfiscaSituation', () => {
        function update() {
            return mesAides(PREVIOUS_STATE, updateOpenfiscaSituation({
                "scenarios": [
                    {
                        "test_case": {
                            "individus": [
                                {
                                    "salaire_net": {
                                        "2013": 50000,
                                    },
                                },
                            ],
                        },
                    },
                ],
            }));
        }

        it('should return an updated state', () => {
            let actual = update();

            expect(actual.openfiscaSituation.scenarios[0].test_case.individus[0].salaire_net['2013']).to.equal(50000);
        });

        it('should keep previous state intact', () => {
            let actual = update();

            expect(PREVIOUS_STATE.openfiscaSituation.scenarios[0].test_case.individus[0].salaire_net['2013']).to.equal(40000);
        });
    });

    describe('notifyFetchResults', () => {
        it('should return an updated state', () => {
            let actual = mesAides(PREVIOUS_STATE, notifyFetchResults());

            expect(actual.waitingForResults).to.be.ok();
        });

        it('should keep previous state intact', () => {
            let actual = mesAides(PREVIOUS_STATE, notifyFetchResults());

            expect(PREVIOUS_STATE.waitingForResults).to.not.be.ok();
        });
    });

    describe('notifyGotResults', () => {
        it('should return an updated state', () => {
            let actual = mesAides(PREVIOUS_STATE, notifyGotResults(OPENFISCA_RESPONSE));

            expect(actual.waitingForResults).to.not.be.ok();
            expect(actual.results).to.eql(OPENFISCA_RESPONSE);
        });

        it('should keep previous state intact', () => {
            let actual = mesAides(PREVIOUS_STATE, notifyGotResults(OPENFISCA_RESPONSE));

            expect(PREVIOUS_STATE.results).to.not.be.ok();
        });
    });
});
