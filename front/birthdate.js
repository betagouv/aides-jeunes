import moment from 'moment';
import objectPath from 'object-path-immutable';

import {
    updateOpenfiscaSituation,
    setError,
} from './actions';
import store from './store';
import bindToForm from './forms';


/**
 * @param {String} property  Property path to set in the OpenFisca situation.
 * @param {String} date  A representation of the birth date to set.
 * @return {Action} A Redux action to be dispatched to the store.
 */
export function update(property, date) {
    const birthdate = moment(date, [
        'DD/MM/YY',  // support shortcut; TODO: should interpret 20 as 1920, not 2020 (Moment defaults to 21st century before 69)
        'DD/MM/YYYY',
        'YYYY-MM-DD',  // browsers that actually support the date element will always format date in ISO format
    ], true);  // strict: don't let Moment be ambiguous and parse partially-typed dates

    if (! birthdate.isValid())
        return setError(property, 'invalid', date);

    const situation = objectPath.set(store.getState().openfiscaSituation, property, birthdate.format('YYYY-MM-DD'));

    return updateOpenfiscaSituation(situation);
}


bindToForm('individus.0.birth', update);
