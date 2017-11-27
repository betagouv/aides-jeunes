var _ = require('lodash');
var moment = require('moment');

var requestedVariables = require('../openfisca/mapping/common').requestedVariables;

module.exports = function extractResults(openfiscaResults, date) {
    var period = moment(date).format('YYYY-MM');

    var individuId = openfiscaResults.menages._.personne_de_reference[0];
    var aideEntity = _.assign({}, openfiscaResults.familles._, openfiscaResults.individus[individuId]);
    return _.reduce(requestedVariables, function(result, aide, aideId) {
        if (aide.type == 'string') {
            return result;
        }

        var non_calculable = (aideEntity[aideId + '_non_calculable'] && aideEntity[aideId + '_non_calculable'][period]);
        if (non_calculable) {
            result[aideId] = non_calculable;
            return result;
        }

        result[aideId] = aideEntity[aideId] && aideEntity[aideId][period];
        if (result[aideId] && ((! aide.type) || aide.type == 'float')) {
            result[aideId] = Number(result[aideId].toFixed(2));
        }
        return result;
    }, {});
};
