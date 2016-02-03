import objectPath from 'object-path-immutable';

import store from './store';
import {
    createOpenfiscaSituationUpdateAction,
    createErrorAction,
} from './actions';
import bindToForm from './forms';


/**
 * @param {String} property  Property path of the OpenFisca situation.
 * @param {String} housingTypeId  Enum value to set.
 * @return {Action} A Redux action to be dispatched to the store.
 */
export function update(property, housingTypeId) {
    if (housingTypeId === '')  // have to validate this manually because "required" attribute cannot be set on a radio group
        return createErrorAction(property, 'required', housingTypeId);

    if (! (housingTypeId > 0 && housingTypeId <= 8))
        return createErrorAction(property, 'invalid', housingTypeId);

    const situation = objectPath.set(store.getState().openfiscaSituation, property, housingTypeId);

    return createOpenfiscaSituationUpdateAction(situation);
}


bindToForm('menages.0.statut_occupation', update);
