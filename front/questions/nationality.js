import objectPath from 'object-path-immutable';

import store from '../store';
import {
    createOpenfiscaSituationUpdateAction,
    createErrorAction,
} from '../actions';


/**
 * @param {String} property  Property path of the OpenFisca situation.
 * @param {String} nationality  Enum value to set.
 * @return {Action} A Redux action to be dispatched to the store.
 */
export function update(property, nationality) {
    if (nationality === '')  // have to validate this manually because "required" attribute cannot be set on a radio group
        return createErrorAction(name, 'required', nationality);

    const situation = objectPath.set(store.getState().openfiscaSituation, property, nationality == 'true');

    return createOpenfiscaSituationUpdateAction(situation);
}

export function next(state = store.getState()) {
    if (! state.openfiscaSituation.individus[0].ressortissant_eee)
        return 'titre-sejour';
}
