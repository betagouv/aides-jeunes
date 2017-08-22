var _ = require('lodash');

var requestedVariables = require('../openfisca/mapping/common').requestedVariables;

module.exports = function extractResults(openfiscaResponse) {
    var period = openfiscaResponse.params.scenarios[0].period.split(':')[1];
    var openfiscaResults = openfiscaResponse.value[0];
    return _.reduce(requestedVariables, function(result, aide, aideId) {
        if (aide.type == 'string') {
            return result;
        }

        var aideEntity = openfiscaResults[(aide.entity || 'famille') + 's'][0];
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
