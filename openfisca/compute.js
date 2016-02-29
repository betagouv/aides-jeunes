require('isomorphic-fetch');  // needs to leak into global namespace for mocking
import moment from 'moment';

import AIDES from '../config/aides';


let requestedAides = Object.keys(AIDES);

requestedAides.forEach((id) => {
    if (AIDES[id].uncomputability)
        requestedAides.push(`${id}_non_calculable`);  // OpenFisca convention to send additional information: if the aide is not computable, this variable will return an identifier for the uncomputability reason that was encountered
});


export function wrap(situation, evaluationDate) {
    return {
        scenarios: [ {
            test_case: situation,
            period: moment(evaluationDate).format('YYYY-MM'),
        } ],
        base_reforms: [
            'aides_ville_paris',
            'aides_cd93',
        ],
        variables: requestedAides,
    };
}

export function compute(scenario) {
    return fetch(`http://${process.env.OPENFISCA_HOST}/api/1/calculate`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify(scenario),
        }).then(response => response.json(),
            error => {
                let result = new Error('OpenFisca communication failed');
                result.previous = error;

                try {
                    result.body = JSON.stringify(response.body, null, 2);  // (null, 2) = "indent by 2 spaces";
                } catch (e) {
                    result.body = 'No response';
                }

                throw result;
            }
        );
}
