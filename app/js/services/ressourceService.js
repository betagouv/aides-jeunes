'use strict';

angular.module('ddsCommon').factory('RessourceService', function(MonthService, categoriesRnc, ressourceTypes) {

    function setDefaultRessourceValueForCurrentYear(dateDeValeur, individu, ressourceType) {
        var key = ressourceType.id;
        individu[key] = individu[key] || {};
        var ressource = individu[key];
        if (_.isEmpty(ressource)) {
            var lastYear = moment(dateDeValeur).subtract('years', 1).format('YYYY');
            if (ressourceType.isMontantAnnuel)
            {
                ressource[lastYear] = 0;
                return;
            }
            if (ressourceType.id == 'tns_auto_entrepreneur_chiffre_affaires')
            {
                ressource[lastYear] = 0;
            }


            var months = MonthService.getMonths(dateDeValeur, 12);
            months.forEach(function(month) {
                ressource[month.id] = 0;
            });

            if (! ressourceType.revenuExceptionnel) {
                ressource[moment(dateDeValeur).format('YYYY-MM')] = 0;
            }
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
        isRessourceOnMainScreen: isRessourceOnMainScreen,
        setDefaultRessourceValueForCurrentYear: setDefaultRessourceValueForCurrentYear,
        extractIndividuSelectedRessourceTypes: extractIndividuSelectedRessourceTypes,
    };
});
