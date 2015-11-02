import request from 'superagent';


export default function compute(situation) {
    return new Promise((resolve, reject) => {
        request
        .post(`http://${process.env.OPENFISCA_HOST}/api/1/calculate`)
        .send(situation)
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
