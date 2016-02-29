export const UPDATE_OPENFISCA_SITUATION = 'UPDATE_OPENFISCA_SITUATION';
export const ERROR = 'ERROR';
export const ASYNC_ACTION_START = 'ASYNC_ACTION_START';
export const ASYNC_ACTION_END = 'ASYNC_ACTION_END';
export const SUGGESTIONS = 'SUGGESTIONS';


/**
 * Create an action to register a modification of the constructed OpenFisca situation.
 * @param {Object} additional The properties to set on the OpenFisca situation.
 * @return {Action}    A redux action to be dispatched to the store.
 */
export function createOpenfiscaSituationUpdateAction(additional) {
    return {
        type: UPDATE_OPENFISCA_SITUATION,
        data: additional,
    }
}

/**
 * Create an action to register the beginning of an async operation.
 * @return {Action}    A redux action to be dispatched to the store.
 */
export function createAsyncStartAction() {
    return {
        type: ASYNC_ACTION_START,
    }
}

/**
 * Create an action to register the end of an async operation.
 * @return {Action}    A redux action to be dispatched to the store.
 */
export function createAsyncEndAction() {
    return {
        type: ASYNC_ACTION_END,
    }
}

/**
 * Create an action to register a list of suggestions to be presented to the user.
 * @param  {Array} suggestions
 * @return {Action}    A redux action to be dispatched to the store.
 */
export function createSuggestResultsAction(suggestions) {
    return {
        type: SUGGESTIONS,
        suggestions,
    }
}

/**
 * Create an action to register an input error.
 * @param {String} source  Name of the field where an input error was added.
 * @param {String} id  Identifier for the input, to display matching explanation to the user.
 * @param {Mixed} value   The value that was considered incorrect.
 * @param {Mixed} details Any additional information the validator wants to pass.
 * @return {Action}    A redux action to be dispatched to the store.
 */
export function createErrorAction(source, id, value, details) {
    return {
        type: ERROR,
        error: { source, id, value, details },
    }
}
