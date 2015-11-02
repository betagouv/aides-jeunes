import superagent from 'superagent';
import mock from 'superagent-mock';


/**
 * Mocks calls to OpenFisca through `superagent` to always reply with fixed response.
 */
export default mock(superagent, [ {
    pattern  : process.env.OPENFISCA_HOST,
    fixtures : (match, params, headers) => require('./openfisca-response.json'),
    post     : (match, body) => { return { body } },
} ]);
