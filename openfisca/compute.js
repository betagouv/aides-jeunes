import request from 'superagent';


export function wrap(situation) {
    return {
        scenarios: [ {
            test_case: situation,
            period: '2015-09',
        } ],
        base_reforms: [
            'aides_ville_paris',
        ],
        variables: [
            'aspa',
            'asi',
            'acs',
            'cmu_c',
            'apl',
            'als',
            'alf',
            'aide_logement',
            'aide_logement_non_calculable',
            'af',
            'rsa',
            'rsa_majore',
            'rsa_non_majore',
            'rsa_non_calculable',
            'asf',
            'cf',
            'ass',
            'paje_base',
            'bourse_college',
            'bourse_lycee',
            'paris_logement_familles'
        ],
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
