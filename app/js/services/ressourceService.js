'use strict';

angular.module('ddsCommon').factory('RessourceService', function(MonthService, categoriesRnc, ressourceTypes) {

    function getPeriodKeysForCurrentYear(dateDeValeur, ressourceType) {
        var periodKeys = [];
        var lastYear = moment(dateDeValeur).subtract('years', 1).format('YYYY');
        if (ressourceType.isMontantAnnuel)
        {
            periodKeys.push(lastYear);
            return periodKeys;
        }
        if (ressourceType.id == 'tns_auto_entrepreneur_chiffre_affaires')
        {
            periodKeys.push(lastYear);
        }

        periodKeys = periodKeys.concat(_.map(MonthService.getMonths(dateDeValeur, 12), 'id'));

        if (! ressourceType.revenuExceptionnel) {
            periodKeys.push(moment(dateDeValeur).format('YYYY-MM'));
        }

        return periodKeys;
    }

    function setDefaultRessourceValueForCurrentYear(dateDeValeur, individu, ressourceType) {
        var key = ressourceType.id;
        individu[key] = individu[key] || {};
        var ressource = individu[key];
        var periodKeys = getPeriodKeysForCurrentYear(dateDeValeur, ressourceType);
        if (_.isEmpty(ressource)) {
            periodKeys.forEach(function(periodKey) {
                ressource[periodKey] = 0;
            });
        }
    }

    function isSelectedForCurrentYear(ressource, ressourceType) {
        if (ressourceType.id != 'pensions_alimentaires_percues') {
            return Boolean(ressource);
        }

        return _.keys(ressource).length > 1;
    }

    function extractIndividuSelectedRessourceTypes(individu) {
        var result = {};
        _.chain(ressourceTypes)
            .filter(isRessourceOnMainScreen)
            .filter(function(ressourceType) { return isSelectedForCurrentYear(individu[ressourceType.id], ressourceType); })
            .forEach(function(ressourceType) { result[ressourceType.id] = true; })
            .value();

        return result;
    }

    function isRessourceOnMainScreen(ressourceOrType) {
        // Make this function robust so that it can be called with a type from the ressourceTypes constant, or just a string.
        var type = ressourceOrType.id || ressourceOrType;
        return type != 'pensions_alimentaires_versees_individu';
    }

    return {
        getPeriodKeysForCurrentYear: getPeriodKeysForCurrentYear,
        isRessourceOnMainScreen: isRessourceOnMainScreen,
        extractIndividuSelectedRessourceTypes: extractIndividuSelectedRessourceTypes,
        setDefaultValueForCurrentYear: setDefaultValueForCurrentYear,
    };
});
