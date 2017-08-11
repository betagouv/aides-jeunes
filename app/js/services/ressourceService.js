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

    function spreadIndividuRessources (individu, months, ressource, dateDeValeur) {
            // injection des valeurs des 3 derniers mois
            var somme3DerniersMois = 0;
            [2, 1, 0].forEach(function(i) {
                var montant = ressource.montantsMensuels[i];
                somme3DerniersMois += montant;
                if (montant) {
                    individu.ressources.push({
                    type: ressource.type.id,
                    periode: months[i].id,
                    montant: montant
                });
                }
            });

            // injection du montant annuel étalé sur les 9 mois restants
            var montantMensuelEtale = (ressource.montantAnnuel - somme3DerniersMois) / 9;
            if (montantMensuelEtale) {
                for (var j = 0; j < 9; j++) {
                    var periode = moment(dateDeValeur).subtract(4 + j, 'months').format('YYYY-MM');
                    individu.ressources.push({
                        type: ressource.type.id,
                        periode: periode,
                        montant: montantMensuelEtale
                    });
                }
            }

            if (! ressource.onGoing) {
                individu.interruptedRessources.push(ressource.type.id);
            }
    }

    function applyYearlyRessource (individu, ressource, dateDeValeur) {
        var montant = ressource.montantAnnuel;
        var periode = moment(dateDeValeur).subtract(1, 'year').format('YYYY');
        if (montant) {
            individu.ressources.push({
                type: ressource.type.id,
                periode: periode,
                montant: montant
            });
        }
    }

    function applyRessourcesToIndividu (individu, ressources, dateDeValeur) {
            var months = MonthService.getMonths(dateDeValeur);
            var previousRessources = individu.ressources;
            individu.ressources = [];
            individu.interruptedRessources = [];

            ressources.forEach(function(ressource) {
                // Ressources for which we have the last 3 months values
                if (ressource.type.category != 'rpns' || ressource.type.id == 'tns_auto_entrepreneur_chiffre_affaires') {
                    spreadIndividuRessources(individu, months, ressource, dateDeValeur);
                // Ressources for which we have only yearly values
                } else {
                    applyYearlyRessource(individu, ressource, dateDeValeur);
                }
            });

            // on réinjecte les ressources RNC & pensions alimentaires
            individu.ressources = individu.ressources.concat(_.filter(previousRessources, function(ressource) {
                return ! isRessourceOnMainScreen(ressource);
            }));
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
        _applyYearlyRessource: applyYearlyRessource, //tested
        applyRessourcesToIndividu: applyRessourcesToIndividu, // used in controllers/foyer/ressources/enfants.js
        isRessourceOnMainScreen: isRessourceOnMainScreen,
        getMainScreenRessources: getMainScreenRessources, // used in controllers/foyer/ressources/enfants.js
        setDefaultRessourceValue: setDefaultRessourceValue,
        extractIndividuSelectedRessourceTypes: extractIndividuSelectedRessourceTypes,
    };
});
