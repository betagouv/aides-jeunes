/*
 * Update OpenFisca patrimoine fields to new ones
 */

var VERSION = 4;
var patrimoineMap = {
    valeur_locative_loue: 'valeur_patrimoine_loue',
    valeur_locative_terrains_non_loue: 'valeur_locative_terrains_non_loues',
    interets_epargne_sur_livrets: {
        field: 'livret_a',
        modifier: function(value) { return 100 * value; }
    },
    epargne_non_remuneree: 'epargne_revenus_non_imposables',
};
var patrimoineKeys = Object.keys(patrimoineMap);

module.exports = {
    function: function(situation) {
        situation.individus.forEach(function(individu) {
            patrimoineKeys.forEach(function(patrimoineKey) {
                var destination = patrimoineMap[patrimoineKey];
                if (typeof destination == 'string') {
                    destination = {
                        field: destination,
                        modifier: function(value) { return value; }
                    };
                }

                var attribute = individu.get(patrimoineKey);
                if (attribute) {
                    var periods = Object.keys(attribute);
                    periods.forEach(function(period) {
                        attribute[period] = destination.modifier(attribute[period]);
                    });

                    individu.set(destination.field, attribute);
                    individu.set(patrimoineKey, undefined, { strict: false });
                }
            });
        });

        return situation;
    },
    version: VERSION
};
