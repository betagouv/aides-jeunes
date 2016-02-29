import objectPath from 'object-path-immutable';

import store from './store';
import {
    createErrorAction,
    createUpdateAdditionalInformationAction,
} from './actions';
import bindToForm from './forms';


/**
 * @param {String} name  Name of the input field.
 * @param {String} nationality  Enum value to set.
 * @return {Action} A Redux action to be dispatched to the store.
 */
export function update(name, nationality) {
    if (nationality === '')  // have to validate this manually because "required" attribute cannot be set on a radio group
        return createErrorAction(name, 'required', nationality);

    const situation = objectPath.set(store.getState().additionalInformation, name, nationality);

    return createUpdateAdditionalInformationAction(situation);
}


bindToForm('nationality', update);
