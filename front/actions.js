export const UPDATE_OPENFISCA_SITUATION = 'UPDATE_OPENFISCA_SITUATION';
export const FETCH_RESULTS = 'FETCH_RESULTS';
export const GOT_RESULTS = 'GOT_RESULTS';
export const ERROR = 'ERROR';


export function updateOpenfiscaSituation(additional) {
    return {
        type: UPDATE_OPENFISCA_SITUATION,
        data: additional,
    }
}

/**
 * Create an action to register an input error.
 * @param {String} source  Name of the field where an input error was added.
 * @param {String} id  Identifier for the input, to display matching explanation to the user.
 * @param {Mixed} value   The value that was considered incorrect.
 * @param {Mixed} details Any additional information the validator wants to pass.
 */
export function setError(source, id, value, details) {
    return {
        type: ERROR,
        error: { source, id, value, details },
    }
}

export function notifyFetchResults() {
    return {
        type: FETCH_RESULTS,
    }
}

export function notifyGotResults(data) {
    return {
        type: GOT_RESULTS,
        results: data,
    }
}
