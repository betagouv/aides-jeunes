import { createStore } from 'redux';

import {
    UPDATE_OPENFISCA_SITUATION,
    FETCH_RESULTS,
    GOT_RESULTS,
    ERROR,
} from './actions';


const STORAGE_KEY = 'state';

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
            return state;
    }
}

export function storageMiddleware(reducer, storage) {
    if (! storage) { // maybe a mock sessionStorage has been passed to allow testing
        if (typeof window == 'undefined')  // we're in Node, no way we can default to window.sessionStorage
            return reducer;  // then don't record anything

        storage = window.sessionStorage;
    }

    return (state, action) => {
        if (! state) {
            let storedItem = storage.getItem(STORAGE_KEY);

            if (storedItem) {
                try {
                    state = JSON.parse(storedItem);
                } catch (err) {
                    console.error(err);
                    console.log('Unreadable state cache, deleting it');
                    storage.removeItem(STORAGE_KEY);
                }
            }
        }

        let result = reducer(state, action);

        if (action.type == UPDATE_OPENFISCA_SITUATION)
            storage.setItem(STORAGE_KEY, JSON.stringify(result));

        return result;
    }
}

const store = createStore(storageMiddleware(reducer));

export default store;

export let subscribe = store.subscribe.bind(store);
export let dispatch = store.dispatch.bind(store);
export let getState = store.getState.bind(store);
