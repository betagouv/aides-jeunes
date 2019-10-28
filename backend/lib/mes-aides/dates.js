var moment = require('moment')
var _ = require('lodash')

function generateMonth(dt) {
    return {
        id: dt.format('YYYY-MM'),
        label: dt.format('MMMM YYYY'),
    }
}

function generateYear(dt) {
    const key = dt.format('YYYY')
    return {
        id: key,
        label: key,
    }
}

function datesGenerator(dateDeValeur) {
    const ref = moment(dateDeValeur);
    return {
        today: {
            id: ref.format('YYYY-MM-DD'),
            value: ref,
            label: 'aujourd\'hui',
        },
        thisMonth: generateMonth(ref),
        thisYear: generateYear(ref),
        oneMonthAgo: generateMonth(ref.clone().subtract(1, 'months')),
        twoMonthsAgo: generateMonth(ref.clone().subtract(2, 'months')),
        threeMonthsAgo: generateMonth(ref.clone().subtract(3, 'months')),
        twelveMonthsAgo: generateMonth(ref.clone().subtract(12, 'months')),
        // 3-element array of the latest 3 months
        last3Months: _.map(_.range(1, 3 + 1), function(monthIndex) {
            return generateMonth(ref.clone().subtract(monthIndex, 'months'))
        }),
        // 12-element array of the latest 12 months
        last12Months: _.map(_.range(1, 12 + 1), function(monthIndex) {
            return generateMonth(ref.clone().subtract(monthIndex, 'months'))
        }),
        lastYear: generateYear(ref.clone().subtract(1, 'years')),
        fiscalYear: generateYear(ref.clone().subtract(2, 'years')),
        // 12-element array of the 12 months in the année fiscale de référence
        fiscalYear12Months: _.map(_.range(12), function(monthIndex) {
            var fiscalYear = moment(ref.clone().subtract(2, 'years').year(), 'YYYY')
            return generateMonth(fiscalYear.clone().add(monthIndex, 'months'))
        }),
        previousFiscalYear: generateYear(ref.clone().subtract(3, 'years')),
        previousFiscalYear12Months: _.map(_.range(12), function(monthIndex) {
            var fiscalYear = moment(ref.clone().subtract(3, 'years').year(), 'YYYY')
            return generateMonth(fiscalYear.clone().add(monthIndex, 'months'))
        })
    }
}

exports.generator = datesGenerator
