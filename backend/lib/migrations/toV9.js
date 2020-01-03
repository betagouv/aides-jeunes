/*
 * Migrate to V42 FRANCE CORE
 */

var VERSION = 9;
var sourceDateKey = '2012-01';
var destinationDateKey = 'month:2012-01:120';
var keys = [
    'epargne_revenus_non_imposables',
    'epargne_revenus_imposables',
    'livret_a',
    'valeur_patrimoine_loue',
    'valeur_terrains_non_loues',
    'valeur_locative_terrains_non_loues',
    'valeur_immo_non_loue',
    'valeur_locative_immo_non_loue',
];

module.exports = {
    function: function(situation) {
        situation.get('individus').forEach(function(individu) {
            keys.forEach(function(key) {
                if (individu[key] && individu[key][sourceDateKey] !== undefined) {
                    if (individu[key][sourceDateKey] !== null) {
                        individu[key][destinationDateKey] = individu[key][sourceDateKey];
                    }

                    delete individu[key][sourceDateKey];
                }
            });
        });

        return situation;
    },
    version: VERSION
};
