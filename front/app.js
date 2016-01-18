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

export function mesAides(state = { openfiscaSituation: {}, results: {} }, action) {
    switch (action.type) {
        case UPDATE_OPENFISCA_SITUATION:
            return Object.assign({}, state,
                { openfiscaSituation: Object.assign({}, state.openfiscaSituation, action.data) }
            );
        case FETCH_RESULTS:
            return Object.assign({}, state,
                {
                    results: {},
                    waitingForResults: true,
                }
            );
        case GOT_RESULTS:
            return Object.assign({}, state,
                {
                    results: action.results,
                    waitingForResults: false,
                }
            );
        default:
            return state
    }
}

window.store = createStore(mesAides);
