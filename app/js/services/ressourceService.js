'use strict';

angular.module('ddsApp').factory('RessourceService', function() {
    return {
        spreadIndividuRessources: function(individu, months, ressource, dateDeValeur) {
            // injection des valeurs des 3 derniers mois
            var somme3DerniersMois = 0;
            [2, 1, 0].forEach(function(i) {
                var montant = ressource.montantsMensuels[i];
                somme3DerniersMois += montant;
                individu.ressources.push({
                    type: ressource.type.id,
                    periode: months[i].id,
                    montant: montant
                });

            });

            // injection du montant annuel étalé sur les 9 mois restants
            var montantMensuelEtale = (ressource.montantAnnuel - somme3DerniersMois) / 9;
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

            if (ressource.interrupted) {
                individu.interruptedRessources.push(ressource.type.id);
            }
        },
        applyYearlyRessource: function(individu, ressource, dateDeValeur) {
            var montant = ressource.montantAnnuel;
            var periode = moment(dateDeValeur).subtract(1, 'year').format('YYYY');
            individu.ressources.push({
                type: ressource.type.id,
                periode: periode,
                montant: montant
            });

            // For  'professions libérales et entrepreneurs', we capture the 'CA' as well as the 'benefice'
            if (ressource.type.id == 'autresRevenusTns') {
                individu.ressources.push({
                    type: 'caAutresRevenusTns',
                    periode: periode,
                    montant: ressource.caAnnuel
                });
            }
        }
    };
});
