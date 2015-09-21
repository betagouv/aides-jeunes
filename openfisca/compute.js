import request from 'superagent';


export default function compute(situation, callback) {
    request
        .post(`http://${process.env.OPENFISCA_HOST}/api/1/calculate`)
        .send(situation)
        .end(function(err, response) {
            callback(err && {
                        error: err,
                        message: 'Communication error with OpenFisca',
                     }, response && response.body);
        });
}
