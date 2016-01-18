import moment from 'moment';

import {
    updateOpenfiscaSituation,
    setError,
} from './actions';
import store from './store';


export function set(date) {
    const birthdate = moment(date, [ 'DD/MM/YY', 'DD/MM/YYYY' ], true);

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
