import objectPath from 'object-path-immutable';

import store from '../store';
import {
    createOpenfiscaSituationUpdateAction,
    createErrorAction,
} from '../actions';


/**
 * @param {String} property  Property path of the OpenFisca situation.
 * @param {String} stayPermitYearsCount  Amount of years since a valid stay permit has been owned by the user.
 * @return {Action} A Redux action to be dispatched to the store.
 */
export function update(property, stayPermitYearsCount) {
    const situation = objectPath.set(store.getState().openfiscaSituation, property, stayPermitYearsCount);

    return createOpenfiscaSituationUpdateAction(situation);
}
