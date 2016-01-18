import moment from 'moment';
import request from 'superagent';

import AIDES from '../config/aides';


let requestedAides = Object.keys(AIDES);

requestedAides.forEach((id) => {
    if (AIDES[id].uncomputability)
        requestedAides.push(`${id}_non_calculable`);  // OpenFisca convention to send additional information: if the aide is not computable, this variable will return an identifier for the uncomputability reason that was encountered
});


export function wrap(situation) {
    return {
        scenarios: [ {
            test_case: situation,
            period: moment().format('YYYY-MM'),
        } ],
        base_reforms: [
            'aides_ville_paris',
        ],
        variables: requestedAides,
    };
}

export function compute(scenario) {
    return new Promise((resolve, reject) => {
        request
        .post(`http://${process.env.OPENFISCA_HOST}/api/1/calculate`)
        .send(scenario)
        .end(function(err, response) {
            if (err) {
                let error = new Error('OpenFisca communication failed');
                error.previous = err;

                try {
                    error.body = JSON.stringify(response.body, null, 2);  // (null, 2) = "indent by 2 spaces";
                } catch (e) {
                    error.body = 'No response';
                }

                return reject(error);
            }

            resolve(response && response.body);
        });
    });
}
