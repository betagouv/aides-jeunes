'use strict';

angular.module('ddsCommon').factory('RessourceService', function($http, MonthService, categoriesRnc, ressourceTypes) {

    function getPeriodKeysForCurrentYear(dateDeValeur, ressourceType) {
        var periodKeys = [];
        var lastYear = moment(dateDeValeur).subtract(1, 'years').format('YYYY');
        if (ressourceType.isMontantAnnuel)
        {
            periodKeys.push(lastYear);
            return periodKeys;
        }
        if (ressourceType.id == 'tns_auto_entrepreneur_chiffre_affaires')
        {
            periodKeys.push(lastYear);
            periodKeys = periodKeys.concat(_.map(MonthService.getMonths(dateDeValeur, 3), 'id'));
        } else {
            periodKeys = periodKeys.concat(_.map(MonthService.getMonths(dateDeValeur, 12), 'id'));
        }

        if (! ressourceType.revenuExceptionnel) {
            periodKeys.push(moment(dateDeValeur).format('YYYY-MM'));
        }

        return periodKeys;
    }

    function setDefaultValueForCurrentYear(dateDeValeur, individu, ressourceType) {
        var ressourceId = ressourceType.id;
        individu[ressourceId] = individu[ressourceId] || {};
        var ressource = individu[ressourceId];
        var periodKeys = getPeriodKeysForCurrentYear(dateDeValeur, ressourceType);

        if (_.some(periodKeys, function(periodKey) { return _.isNumber(ressource[periodKey]); })) {
            return;
        }

        periodKeys.forEach(function(periodKey) {
            ressource[periodKey] = ressource[periodKey] || 0;
        });
    }

    function unsetForCurrentYear(dateDeValeur, entity, ressourceType) {
        var ressourceId = ressourceType.id;
        entity[ressourceId] = entity[ressourceId] || {};
        var ressource = entity[ressourceId];
        var periodKeys = getPeriodKeysForCurrentYear(dateDeValeur, ressourceType);
        periodKeys.forEach(function(periodKey) {
            delete ressource[periodKey];
        });

        if (_.isEmpty(ressource)) {
            delete entity[ressourceId];
        }
    }

    var ressourcesForTrailingMonthsAndFiscalYear = categoriesRnc.filter(function(fiscalRessource) {
        return fiscalRessource.sources && fiscalRessource.sources.indexOf(fiscalRessource.id) >= 0;
    }).map(function(fiscalRessource) { return fiscalRessource.id; });

    function isSelectedForCurrentYear(ressource, ressourceIdOrType) {
        // A single value means that ONLY a YM2 value has been specified
        // Multiple values means that CY values were specified
        if (ressourcesForTrailingMonthsAndFiscalYear.indexOf(ressourceIdOrType.id || ressourceIdOrType) >= 0) {
            return _.keys(ressource).length > 1;
        }

        return Boolean(ressource);
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

    function getParameterFromOpenfisca(parameterId) {
        return $http.get('/api/parameters/' + parameterId)
            .then(function(resp) {
                var values = resp.data.values;
                var sortedByDates = Object.keys(values).sort();
                var latestValue = values[sortedByDates.pop()];
                return latestValue;
            });
    }

    return {
        getPeriodKeysForCurrentYear: getPeriodKeysForCurrentYear,
        isRessourceOnMainScreen: isRessourceOnMainScreen,
        isSelectedForCurrentYear: isSelectedForCurrentYear,
        extractIndividuSelectedRessourceTypes: extractIndividuSelectedRessourceTypes,
        setDefaultValueForCurrentYear: setDefaultValueForCurrentYear,
        unsetForCurrentYear: unsetForCurrentYear,
        getParameterFromOpenfisca: getParameterFromOpenfisca
    };
});
