import '../cross-browser/fetch';

import Question from './Question';
import store from '../store';
import {
    createAsyncStartAction,
    createAsyncEndAction,
    createSuggestResultsAction,
    createErrorAction,
} from '../actions';


export default new Question({
    route(state) {
        if (state.suggestions && state.suggestions.length)
            return 'ville';
    }
});

if (typeof window != 'undefined') {  // allow testing on the backend
    document.querySelector('input[name="postalCode"]')
            .addEventListener('change', event => {
                const value = event.target.value;

                if (! value.match(new RegExp(event.target.pattern)))
                    return;

                store.dispatch(update(event.target.name, value));
            });
}

/**
 * @param {String} inputName  Name of the input that sent this value.
 * @param {String} postalCode  The postal code entered by the user.
 * @param {Function} [callback]  The function to execute when communes are identified for the given postal code.
 * @return {Action} A Redux action to be dispatched to the store.
 */
export function update(inputName, postalCode, callback = setCommune) {
    return dispatch => {
        dispatch(createAsyncStartAction());

        return fetch(`https://apicarto.sgmap.fr/codes-postaux/communes/${postalCode}`)
            .then(parseResponse, parseResponse)
            .then(matchingCommunes => {
                callback(matchingCommunes[0]);

                if (matchingCommunes.length > 1)
                    dispatch(createSuggestResultsAction(matchingCommunes));
                else
                    dispatch(createSuggestResultsAction([]));
            }, error => {
                callback({});
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
 * Set INSEE code.
 * @param  {Object?} commune An Object with a `codeInsee` property matching an OpenFisca depcom.
 * @see http://legislation.openfisca.fr/variables/depcom
 */

function setCommune(commune = {}) {
    document.querySelector('input[type="hidden"]').value = commune.codeInsee;
}

