import moment from 'moment';

import {
    updateOpenfiscaSituation,
    setError,
} from './actions';
import store from './store';


export function set(date) {
    const birthdate = moment(date, [
        'DD/MM/YY',  // support shortcut; TODO: should interpret 20 as 1920, not 2020 (Moment defaults to 21st century before 69)
        'DD/MM/YYYY',
        'YYYY-MM-DD',  // browsers that actually support the date element will always format date in ISO format
    ], true);  // strict: don't let Moment be ambiguous and parse partially-typed dates

    if (! birthdate.isValid()) {
        return store.dispatch(setError('individus[0].birth', 'invalid', date));
    }

    return store.dispatch(updateOpenfiscaSituation({
        scenarios: [ {
            test_case: {
                individus: [ {
                    birth: birthdate.format('YYYY-MM-DD'),
                } ],
            },
        } ],
    }));
}
