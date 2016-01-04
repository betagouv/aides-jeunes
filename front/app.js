import { createStore } from 'redux';


export const UPDATE_OPENFISCA_SITUATION = 'UPDATE_OPENFISCA_SITUATION';
export const FETCH_RESULTS = 'FETCH_RESULTS';
export const GOT_RESULTS = 'GOT_RESULTS';


export function updateOpenfiscaSituation(additional) {
    return {
        type: UPDATE_OPENFISCA_SITUATION,
        data: additional,
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

function mesAides(state, action) {
    switch (action.type) {
        case UPDATE_OPENFISCA_SITUATION:
            return Object.assign({}, state,
                { openfiscaSituation: Object.assign({}, state.openfiscaSituation, action.data) }
            );
        case GOT_RESULTS:
            return Object.assign({}, state,
                { results: action.results }
            );
        default:
            return state
    }
}

let store = createStore(mesAides);
