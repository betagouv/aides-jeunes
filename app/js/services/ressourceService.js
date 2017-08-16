'use strict';

angular.module('ddsCommon').factory('RessourceService', function(MonthService, categoriesRnc, ressourceTypes) {

    function setDefaultRessourceValue(dateDeValeur, individu, ressourceType) {
        var key = ressourceType.id;
        individu[key] = individu[key] || {};
        var ressource = individu[key];
        if (_.isEmpty(ressource)) {
            if (ressourceType.isMontantAnnuel)
            {
                ressource[moment(dateDeValeur).subtract('years', 1).format('YYYY')] = 0;
                return;
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

    function extractIndividuSelectedRessourceTypes(individu) {
        var result = {};
        _.chain(ressourceTypes)
            .map('id')
            .uniq()
            .filter(isRessourceOnMainScreen)
            .filter(function(ressourceType) { return individu[ressourceType]; })
            .forEach(function(ressourceType) { result[ressourceType] = true; })
            .value();

        return result;
    }

    function isRessourceOnMainScreen(ressourceOrType) {
        // Make this function robust so that it can be called with a ressource from individu.ressources, a type from the ressourceTypes constant, or just a string.
        var type = ressourceOrType.type || ressourceOrType.id || ressourceOrType;
        return type != 'pensions_alimentaires_versees_individu' && ! _.find(categoriesRnc, { id: type });
    }

    function getMainScreenRessources(individu) {
        return individu.ressources && individu.ressources.filter(isRessourceOnMainScreen) || [];
    }

    return {
        isRessourceOnMainScreen: isRessourceOnMainScreen,
        getMainScreenRessources: getMainScreenRessources, // used in controllers/foyer/ressources/enfants.js
        setDefaultRessourceValue: setDefaultRessourceValue,
        extractIndividuSelectedRessourceTypes: extractIndividuSelectedRessourceTypes,
    };
});
