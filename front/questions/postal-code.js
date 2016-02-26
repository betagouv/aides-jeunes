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
        dispatch(createAsyncStartAction());

        return fetch(`https://apicarto.sgmap.fr/codes-postaux/communes/${postalCode}`)
            .then(parseResponse, parseResponse)
            .then(matchingCommunes => {
                dispatch(setCommune(matchingCommunes[0]));

                if (matchingCommunes.length > 1)
                    dispatch(createSuggestResultsAction(matchingCommunes));
                else
                    dispatch(createSuggestResultsAction([]));
            }, error => {
                dispatch(setCommune({}));
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
 * @param  {Object?} commune An Object with a `codeInsee` property matching an OpenFisca depcom.
 * @return {Action} A Redux action to be dispatched to the store.
 * @see http://legislation.openfisca.fr/variables/depcom
 */
function setCommune(commune = {}) {
    const situation = objectPath.set(store.getState().openfiscaSituation, INSEE_CODE_PROPERTY_PATH,  commune.codeInsee);

    return createOpenfiscaSituationUpdateAction(situation);
}
