/*
 * Migrate to V39
 * https://github.com/openfisca/openfisca-france/pull/1284
 *
 * Replace salaire_net_hors_revenus_exceptionnels, primes_salaires_net and indemnite_fin_contrat_net
 * by a single variable salaire_net
 */

var VERSION = 8;

var sources = [
    'salaire_net_hors_revenus_exceptionnels',
    'primes_salaires_net',
    'indemnite_fin_contrat_net',
];

var destination = 'salaire_net';

module.exports = {
    function: function(situation) {
        situation.get('individus').forEach(function(individu) {
            var dest = {};
            sources.forEach(function(sourceName) {
                var source = individu[sourceName];
                if (source) {
                    var sourceKeys = Object.keys(source);
                    sourceKeys.forEach(function(key) {
                        dest[key] = (dest[key] | 0) + source[key];
                    });
                    delete individu[sourceName];
                }
            });

            if (Object.keys(dest)) {
                individu[destination] = dest;
            }
        });

        return situation;
    },
    version: VERSION
};
