var concat = require('lodash/concat');
var isNumber = require('lodash/isNumber');
var some = require('lodash/some');

var moment = require('moment');

var common = require('../common');
var individuRessources = require('./ressources');
var ressources = require('../../../../../app/js/constants/ressources');

var ressourcesToDuplicate = concat(
    Object.keys(individuRessources.computedRessources),
    ressources.ressourceTypes.map(function(ressourceType) { return ressourceType.id; })
);

function proxyWithCurrentResources(individu, dateDeValeur) {
    var periods = common.getPeriods(dateDeValeur);
    ressourcesToDuplicate.forEach(function(ressourceTypeName) {
        var result = individu[ressourceTypeName];
        if (! result)
            return;
        // Variables can be defined on a yearly or a monthly basis
        if (isNumber(result[periods.lastYear])) {
            result[periods.fiscalYear] = result[periods.lastYear];
        } else {
            var sumOverLast12Months = periods.last12Months.reduce(function(sum, periodObject) {
                return sum + (result[periodObject] || 0);
            }, 0);
            if (sumOverLast12Months) {
                var months = [].concat(periods.fiscalYear12Months, periods.previousFiscalYear12Months);
                months.forEach(function(month) {
                    result[month] = sumOverLast12Months / 12;
                });
            }
        }
    });
}

function extendFiscalDataBackward(individu, dateDeValeur) {
    var periods = common.getPeriods(dateDeValeur);
    var fy = periods.fiscalYear;
    var pfy = periods.previousFiscalYear;

    ressources.categoriesRnc.forEach(function(ressource) {
        if (!individu[ressource.id]) {
            return;
        }

        if (!isNumber(individu[ressource.id][fy])) {
            return;
        }

        if (ressource.yearly) {
            individu[ressource.id][pfy] = individu[ressource.id][fy];
        } else {
            var result = individu[ressource.id];
            var monthlyValue = result[fy] / 12;

            var months = [].concat(periods.fiscalYear12Months, periods.previousFiscalYear12Months);
            months.forEach(function(month) {
                result[month] = monthlyValue;
            });

            delete result[fy];
        }
    });

}

function ressourcesYearMoins2Captured(situation) {
    var yearMoins2 = moment(situation.dateDeValeur).subtract(2, 'years').format('YYYY');
    var januaryYearMoins2 = yearMoins2 + '-01';
    var hasRfr = situation.foyer_fiscal && some(situation.foyer_fiscal.rfr, isNumber);
    var hasYm2Ressources = common.getIndividusSortedParentsFirst(situation).some(function(individu) {
        return some(ressources.categoriesRnc, function(categorieRnc) {
            if (! individu[categorieRnc.id])
                return false;

            return some([
                individu[categorieRnc.id][yearMoins2],
                individu[categorieRnc.id][januaryYearMoins2]
            ], isNumber);
        });
    });
    return hasRfr || hasYm2Ressources;
}

function proxyRessources(individu, situation) {
    if (! ressourcesYearMoins2Captured(situation)) {
        proxyWithCurrentResources(individu, situation.dateDeValeur);
    } else {
        extendFiscalDataBackward(individu, situation.dateDeValeur);
    }
}

proxyRessources.proxyWithCurrentResources = proxyWithCurrentResources;
proxyRessources.extendFiscalDataBackward = extendFiscalDataBackward;

module.exports = proxyRessources;
