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
                    individu.ressourcesYearlyApproximation = individu.ressourcesYearlyApproximation || {};
                    individu.ressourcesYearlyApproximation[ressource.type.id] = ressource.montantAnnuel;
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

            // For  'professions libérales et entrepreneurs', we capture the 'CA' as well as the 'benefice'
            if (ressource.type.id == 'autresRevenusTns' && ressource.caAnnuel) {
                individu.ressources.push({
                    type: 'caAutresRevenusTns',
                    periode: periode,
                    montant: ressource.caAnnuel
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
                if (ressource.type.category != 'rpns' || ressource.type.id == 'caAutoEntrepreneur') {
                    spreadIndividuRessources(individu, months, ressource, dateDeValeur);
                // Ressources for which we have only yearly values
                } else {
                    applyYearlyRessource(individu, ressource, dateDeValeur);
                }
            });

            // on réinjecte les ressources RNC & pensions alimentaires
            individu.ressources = individu.ressources.concat(_.where(previousRessources, function(ressource) {
                return _.find(categoriesRnc, { id: ressource.type }) || _.contains(['pensionsAlimentairesVersees'], ressource.type);
        }));
        }

    function isRessourceOnMainScreen(ressourceType) {
        return ressourceType != 'pensionsAlimentairesVersees' && ! _.find(categoriesRnc, { id: ressourceType });
    }

    function getMainScreenRessources(individu) {
        return individu.ressources && individu.ressources.filter(function(ressource) {
            return isRessourceOnMainScreen(ressource.type);
        });
    }

    return {
        spreadIndividuRessources: spreadIndividuRessources,
        applyYearlyRessource: applyYearlyRessource,
        applyRessourcesToIndividu: applyRessourcesToIndividu,
        isRessourceOnMainScreen: isRessourceOnMainScreen,
        getMainScreenRessources: getMainScreenRessources
    };
});
