import superagent from 'superagent';
import mock from 'superagent-mock';


let stub;

/**
 * Mocks calls to OpenFisca through `superagent` to always reply with fixed response.
 */
export function start() {
    stub = mock(superagent, [ {
        pattern  : process.env.OPENFISCA_HOST,
        fixtures : (match, params, headers) => require('./openfisca-response.json'),
        post     : (match, body) => { return { body } },
    } ]);

    console.log('OpenFisca responses are now fake');
}

/**
 * Stop mocking calls to OpenFisca.
 */
export function stop() {
    if (! stub)
        return;

    stub.unset();
    stub = null;

    console.log('OpenFisca responses are not fake anymore');
}
