import moment from 'moment';
import objectPath from 'object-path-immutable';

import {
    updateOpenfiscaSituation,
    setError,
} from './actions';
import store from './store';


const NAME = 'individus.0.birth';

export function set(date) {
    const birthdate = moment(date, [
        'DD/MM/YY',  // support shortcut; TODO: should interpret 20 as 1920, not 2020 (Moment defaults to 21st century before 69)
        'DD/MM/YYYY',
        'YYYY-MM-DD',  // browsers that actually support the date element will always format date in ISO format
    ], true);  // strict: don't let Moment be ambiguous and parse partially-typed dates

    if (! date)
        return store.dispatch(setError(NAME, 'required', date));

    if (! birthdate.isValid())
        return store.dispatch(setError(NAME, 'invalid', date));

    const situation = objectPath.set(store.getState().openfiscaSituation, NAME, birthdate.format('YYYY-MM-DD'));

    return store.dispatch(updateOpenfiscaSituation(situation));
}
