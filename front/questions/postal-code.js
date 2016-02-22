require('whatwg-fetch');
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
    window
        .fetch(`https://apicarto.sgmap.fr/codes-postaux/communes/${postalCode}`)
        .then(parseResponse, parseResponse)
        .then(createActionForMatchingCommunes,
            error => createErrorAction(inputName, error.id, postalCode, error)
        ).then(action => {
            store.dispatch(action);
            store.dispatch(createAsyncEndAction());
        }).catch(console.error.bind(console));

    return createAsyncStartAction();
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

    if (response.status == 404)
        error.id = 'invalid';

    throw error;
}

function createActionForMatchingCommunes(matchingCommunes) {
    if (matchingCommunes.length == 1)
        return updateDepCom(matchingCommunes[0].codeInsee);

    return createSuggestResultsAction(matchingCommunes);
    updateDepCom(null); // TODO: combine both in a single action
}

/**
 * Set INSEE code in OpenFisca situation.
 * @param  {String} depcom http://legislation.openfisca.fr/variables/depcom
 * @return {Action} A Redux action to be dispatched to the store.
 */
function updateDepCom(depcom) {
    const situation = objectPath.set(store.getState().openfiscaSituation, INSEE_CODE_PROPERTY_PATH, depcom);

    return createOpenfiscaSituationUpdateAction(situation);
}
