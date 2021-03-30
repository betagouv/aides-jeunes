var moment = require('moment');
var range = require('lodash/range');
var assign = require('lodash/assign')

var { forEach } = require('../../../../app/js/constants/benefits/back');

exports.isIndividuValid = function(individu, situation) {
    var age = moment(situation.dateDeValeur).diff(moment(individu.date_naissance), 'years');
    return individu._role != 'enfant' || age <= 25 || individu.handicap;
};

exports.getDemandeur = function(situation) {
    return situation.demandeur;
};

exports.getConjoint = function(situation) {
    return situation.conjoint;
};

exports.getEnfants = function(situation) {
    return situation.enfants;
};

exports.getIndividusSortedParentsFirst = function(situation) {
    return [].concat(
        exports.getDemandeur(situation),
        exports.getConjoint(situation),
        exports.getEnfants(situation)
    ).filter(function(individu) { return individu; });
};

exports.getPeriods = function (dateDeValeur) {
    dateDeValeur = moment(dateDeValeur);
    return {
        thisMonth: dateDeValeur.format('YYYY-MM'),
        '1MonthsAgo': dateDeValeur.clone().subtract(1, 'months').format('YYYY-MM'),
        '2MonthsAgo': dateDeValeur.clone().subtract(2, 'months').format('YYYY-MM'),
        '3MonthsAgo': dateDeValeur.clone().subtract(3, 'months').format('YYYY-MM'),
        // 3-element array of the latest 3 months
        last3Months: range(1, 3 + 1).map(function(monthIndex) {
            return dateDeValeur.clone().subtract(monthIndex, 'months').format('YYYY-MM');
        }),
        // 12-element array of the latest 12 months
        last12Months: range(1, 12 + 1).map(function(monthIndex) {
            return dateDeValeur.clone().subtract(monthIndex, 'months').format('YYYY-MM');
        }),
        thisYear: dateDeValeur.clone().format('YYYY'),
        lastYear: dateDeValeur.clone().subtract(1, 'years').format('YYYY'),
        fiscalYear: dateDeValeur.clone().subtract(2, 'years').format('YYYY'),
        // 12-element array of the 12 months in the année fiscale de référence
        fiscalYear12Months: range(12).map(function(monthIndex) {
            var fiscalYear = moment(dateDeValeur.clone().subtract(2, 'years').year(), 'YYYY');
            return fiscalYear.clone().add(monthIndex, 'months').format('YYYY-MM');
        }),
        previousFiscalYear: dateDeValeur.clone().subtract(3, 'years').format('YYYY'),
        previousFiscalYear12Months: range(12).map(function(monthIndex) {
            var fiscalYear = moment(dateDeValeur.clone().subtract(3, 'years').year(), 'YYYY');
            return fiscalYear.clone().add(monthIndex, 'months').format('YYYY-MM');
        }),
        '3YearsAgo': dateDeValeur.clone().subtract(3, 'years').format('YYYY-MM'),
    };
};

let requestedVariables = {}
forEach((aide, aideId) => {
    requestedVariables[aideId] = assign({}, aide)
    if (aide.uncomputability)
        requestedVariables[aideId + '_non_calculable'] = assign({}, aide, { type: 'string' })

    if (aide.extra) {
        aide.extra.forEach(function(extra) {
            requestedVariables[extra.id] = assign({}, extra)
        })
    }
})

exports.requestedVariables = requestedVariables
