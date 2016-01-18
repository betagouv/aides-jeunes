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

export function setError(type, source, details) {
    return {
        type: ERROR,
        error: { type, source, details },
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
