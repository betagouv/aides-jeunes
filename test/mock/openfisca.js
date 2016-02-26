require('isomorphic-fetch');  // needs to leak into global namespace for mocking
import mock from 'fetch-mock';


/**
 * Mocks calls to OpenFisca to always reply with fixed response.
 */
export function start() {
    mock.mock(`http://${process.env.OPENFISCA_HOST}/api/1/calculate`, 'post', require('./openfisca-response.json'));

    console.log('OpenFisca responses are now fake');
}

/**
 * Stop mocking calls to OpenFisca.
 */
export function stop() {
    mock.restore();

    console.log('OpenFisca responses are not fake anymore');
}
