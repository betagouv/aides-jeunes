import objectPath from 'object-path-immutable';

import {
    updateOpenfiscaSituation,
} from './actions';
import store from './store';


const NAME = 'menages.0.statut_occupation';

export function set(value) {
    const situation = objectPath.set(store.getState().openfiscaSituation, NAME, value);

    return store.dispatch(updateOpenfiscaSituation(situation));
}
