require('isomorphic-fetch');
import objectPath from 'object-path-immutable';

import store from '../store';
import {
    createOpenfiscaSituationUpdateAction,
    createAsyncStartAction,
    createAsyncEndAction,
    createSuggestResultsAction,
    createErrorAction,
} from '../actions';

const INSEE_CODE_PROPERTY_PATH = 'menages.0.depcom';


/**
 * @param {String} inputName  Name of the input that sent this value.
 * @param {String} postalCode  The postal code entered by the user.
 * @return {Action} A Redux action to be dispatched to the store.
 */
export function update(inputName, postalCode) {
    return dispatch => {
        return Promise.resolve(createAsyncStartAction())
            .then(() => fetch(`https://apicarto.sgmap.fr/codes-postaux/communes/${postalCode}`))
            .then(parseResponse, parseResponse)
            .then(matchingCommunes => {
                dispatch(updateDepCom(matchingCommunes[0] && matchingCommunes[0].codeInsee));

                if (matchingCommunes.length > 1)
                    dispatch(createSuggestResultsAction(matchingCommunes));
                else
                    dispatch(createSuggestResultsAction([]));
            }, error => {
                dispatch(updateDepCom(null));
                dispatch(createSuggestResultsAction([]));
                dispatch(createErrorAction(inputName, error.id, postalCode, error));
            })
            .then(() => {
                dispatch(createAsyncEndAction());
            })
            .catch(console.error.bind(console));
    }
}

/**
 * Parse the codes-postaux API call response.
 * @param  {Object|Error} response The passed response or error from the `window.fetch` call.
 * @return {Array}  The list of potential code-postaux instances sent by the API.
 * @throws {Error}  If the response code was not 200. Will have an `id` to reference the message to present to the user.
 */
export function parseResponse(response) {
    if (response.ok)
        return response.json();

    const error = new Error(response.statusText || response.message);
    error.id = 'communication';

    if (response.status == 400 || response.status == 404)
        error.id = 'invalid';

    throw error;
}

/**
 * Set INSEE code in OpenFisca situation.
 * @param  {String|null} depcom http://legislation.openfisca.fr/variables/depcom
 * @return {Action} A Redux action to be dispatched to the store.
 */
function updateDepCom(depcom) {
    const situation = objectPath.set(store.getState().openfiscaSituation, INSEE_CODE_PROPERTY_PATH, depcom);

    return createOpenfiscaSituationUpdateAction(situation);
}
