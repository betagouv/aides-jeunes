var _ = require('lodash');
var common = require('./common');

var {additionalProps} = require('./individu');
var definitions = require('../../definitions');

function determinePropsToReplicate(entityTypeName, entityDefinition) {
    let keyList = Object.keys(entityDefinition)

    let filtered = keyList.filter(key => {
        let type = entityDefinition[key].type || entityDefinition[key]
        return key != 'id' && !key.startsWith('_') && typeof type == 'function' && type != Object
    })

    if (entityTypeName == 'individu') {
        return _.uniq(filtered.concat(...Object.keys(additionalProps)))
    } else {
        return filtered
    }
}

const types = ['famille', {type: 'foyerFiscal', plural: 'foyers_fiscaux'}, 'individu', 'menage']
var forDuplication = types.reduce((accum, type) => {
    var plural = type.type ? type.plural : type + 's'
    type = type.type ? type.type : type
    accum[plural] = determinePropsToReplicate(type, definitions[type])
    return accum
}, {})

function copyTo3PreviousMonths(testCase, dateDeValeur) {
    var periodKeys = ['thisMonth', '1MonthsAgo', '2MonthsAgo', '3MonthsAgo'];
    var periods = common.getPeriods(dateDeValeur);

    Object.keys(forDuplication).forEach(function(entityName) {
        forDuplication[entityName].forEach(function(entityPropertyName) {
            _.forEach(testCase[entityName], function(entity) {
                var value = entity[entityPropertyName];
                var result = {};
                if (value !== undefined) {
                    periodKeys.forEach(function(periodKey) {
                        result[periods[periodKey]] = value;
                    });
                    entity[entityPropertyName] = result;
                }
            });
        });
    });
}

module.exports = copyTo3PreviousMonths;
