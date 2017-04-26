'use strict';

angular.module('ddsApp').factory('RessourceService', function(SituationService, categoriesRnc) {

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
            var months = SituationService.getMonths(dateDeValeur);
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
            individu.ressources = individu.ressources.concat(_.where(previousRessources, function(ressource) {
                return ! isRessourceOnMainScreen(ressource);
            }));
    }

    function isRessourceOnMainScreen(ressourceOrType) {
        // Make this function robust so that it can be called with a ressource from individu.ressources, a type from the ressourceTypes constant, or just a string.
        var type = ressourceOrType.type || ressourceOrType.id || ressourceOrType;
        return type != 'pensionsAlimentairesVersees' && ! _.find(categoriesRnc, { id: type });
    }

    function getMainScreenRessources(individu) {
        return individu.ressources && individu.ressources.filter(isRessourceOnMainScreen) || [];
    }

    function roundToCents(amount) {
        return Math.round(amount * 100) / 100;
    }

    return {
        spreadIndividuRessources: spreadIndividuRessources,
        applyYearlyRessource: applyYearlyRessource,
        applyRessourcesToIndividu: applyRessourcesToIndividu,
        isRessourceOnMainScreen: isRessourceOnMainScreen,
        getMainScreenRessources: getMainScreenRessources,
        roundToCents: roundToCents,
    };
});
