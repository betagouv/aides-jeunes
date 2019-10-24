import moment from 'moment'
import _ from 'lodash'

function get(baseDate, count, downTo) {
    var refDate = baseDate ? moment(baseDate) : moment();
    if (! count) { count = 3; }
    if (! downTo) { downTo = 0; }
    refDate.subtract(count + downTo + 1, 'months');
    return _.map(_.range(count + downTo, downTo, -1), function() {
        refDate.add(1, 'months');
        return {
            id: refDate.format('YYYY-MM'),
            label: refDate.format('MMMM YYYY')
        };
    });
}

const Mois = {
    get
}

export default Mois
