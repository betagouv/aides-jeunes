import moment from 'moment';

import { createErrorAction } from '../actions';
import Question from './Question';


export default new Question({
    validate(dateInput) {
        const birthdate = parse(dateInput.value);

        if (! birthdate.isValid())
            return createErrorAction(this.openFiscaPropertyPath, 'invalid', dateInput.value);
    },

    format(date) {
        return parse(date).format('YYYY-MM-DD');
    }
});

function parse(date) {
    return moment(date, [
        'DD/MM/YY',  // support shortcut; TODO: should interpret 20 as 1920, not 2020 (Moment defaults to 21st century before 69)
        'DD/MM/YYYY',
        'YYYY-MM-DD',  // browsers that actually support the date element will always format date in ISO format
    ], true);  // strict: don't let Moment be ambiguous and parse partially-typed dates
}
