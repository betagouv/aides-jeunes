var _ = require('lodash');
var moment = require('moment');

var common = require('../common');
var individuRessources = require('./ressources');
var ressources = require('../../../../../app/js/constants/ressources.js');

var ressourcesToDuplicate = _.concat(
    Object.keys(individuRessources.computedRessources),
    ressources.ressourceTypes.map(function(ressourceType) { return ressourceType.id; })
);

function duplicateRessourcesForAnneeFiscaleDeReference(individu, dateDeValeur) {
    var periods = common.getPeriods(dateDeValeur);
    ressourcesToDuplicate.forEach(function(ressourceTypeName) {
        var result = individu[ressourceTypeName];
        if (! result)
            return;
        // Variables can be defined on a yearly or a monthly basis
        if (result[periods.lastYear]) {
            result[periods.anneeFiscaleReference] = result[periods.lastYear];
        } else {
            var sumOverLast12Months = periods.last12Months.reduce(function(sum, periodObject) {
                return sum + (result[periodObject] || 0);
            }, 0);
            if (sumOverLast12Months) {
                periods.anneeFiscaleReference12Months.forEach(function(month) {
                    result[month] = sumOverLast12Months / 12;
                });
            }
        }
    });
}

function ressourcesYearMoins2Captured(situation) {
    var yearMoins2 = moment(situation.dateDeValeur).subtract(2, 'years').format('YYYY');
    var januaryYearMoins2 = yearMoins2 + '-01';
    var hasRfr = situation.foyer_fiscal && _.some(situation.foyer_fiscal.rfr, _.isNumber);
    var hasYm2Ressources = situation.individus.some(function(individu) {
        return _.some(ressources.categoriesRnc, function(categorieRnc) {
            if (! individu[categorieRnc.id])
                return false;

            return _.some([
                individu[categorieRnc.id][yearMoins2],
                individu[categorieRnc.id][januaryYearMoins2]
            ], _.isNumber);
        });
    });
    return hasRfr || hasYm2Ressources;
}

function proxyRessources(individu, situation) {
    if (! ressourcesYearMoins2Captured(situation)) {
        duplicateRessourcesForAnneeFiscaleDeReference(individu, situation.dateDeValeur);
    }
}

module.exports = proxyRessources;
