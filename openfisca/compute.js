import request from 'superagent';


export default function compute(situation) {
    return new Promise((resolve, reject) => {
        request
        .post(`http://${process.env.OPENFISCA_HOST}/api/1/calculate`)
        .send(situation)
        .end(function(err, response) {
            if (err) {
                return reject({
                    error: err,
                    message: 'Communication error with OpenFisca',
                    body: response && response.body,
                });
            }

            resolve(response && response.body);
        });
    });
}
