import objectPath from 'object-path-immutable';

import {
    updateOpenfiscaSituation,
    setError,
} from './actions';
import store from './store';


const NAME = 'menages.0.statut_occupation';

export function set(value) {
    if (! value)
        return store.dispatch(setError(NAME, 'required', value));

    if (! (value > 0 && value <= 8))
        return store.dispatch(setError(NAME, 'invalid', value));

    const situation = objectPath.set(store.getState().openfiscaSituation, NAME, value);

    return store.dispatch(updateOpenfiscaSituation(situation));
}
