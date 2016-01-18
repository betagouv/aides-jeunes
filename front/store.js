import { createStore } from 'redux';

import {
    UPDATE_OPENFISCA_SITUATION,
    FETCH_RESULTS,
    GOT_RESULTS,
    ERROR,
} from './actions';


function mesAides(state = { openfiscaSituation: {}, results: {} }, action) {
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

const store = createStore(mesAides);

export default store;

export let subscribe = store.subscribe.bind(store);
export let dispatch = store.dispatch.bind(store);
export let getState = store.getState.bind(store);
