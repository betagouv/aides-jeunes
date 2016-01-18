import { createStore } from 'redux';

import {
    UPDATE_OPENFISCA_SITUATION,
    FETCH_RESULTS,
    GOT_RESULTS,
    ERROR,
} from './actions';


export const INITIAL_STATE = {
    openfiscaSituation: require('../test/mock/situation.json').scenarios[0].test_case,
};


export function reducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case UPDATE_OPENFISCA_SITUATION:
            return Object.assign({}, state,
                {
                    openfiscaSituation: action.data,
                    error: null,
                }
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
        case ERROR:
            return Object.assign({}, state,
                {
                    error: action.error,
                }
            );
        default:
            return state
    }
}

const store = createStore(reducer);

export default store;

export let subscribe = store.subscribe.bind(store);
export let dispatch = store.dispatch.bind(store);
export let getState = store.getState.bind(store);
