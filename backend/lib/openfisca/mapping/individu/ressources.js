var _ = require('lodash');

var TAUX_CSG_CRDS = 0.029,
    ASSIETTE_COTIS = 0.9825,
    RATIO_NET_BRUT = 0.78;

function salaireNetToBrut(value) {
    return value / RATIO_NET_BRUT;
}

function salaireNetToImposable(value) {
    return value + TAUX_CSG_CRDS * ASSIETTE_COTIS * value / RATIO_NET_BRUT;
}

var individuRessources = {
    chomage_brut: [{
        src: 'chomage_net',
        fn: function(value) {
            return value / (1 - (((0.062 + 0.005) * 0.9825) + 0.028));
        }
    }],
    retraite_brute: [{
        src: 'retraite_nette',
        fn: function(value) {
            // approximation prélèvement moyen de 7.4 % de cotisations sociales (csg-crds)
            return value / 0.926;
        }
    }],
    salaire_de_base: [
        {
            src: 'salaire_net_hors_revenus_exceptionnels',
            fn: salaireNetToBrut
        },
        {
            src: 'primes_salaires_net',
            fn: salaireNetToBrut
        },
        {
            src: 'indemnite_fin_contrat_net',
            fn: salaireNetToBrut
        }
    ],
    salaire_imposable: [
        {
            src: 'salaire_net_hors_revenus_exceptionnels',
            fn: salaireNetToImposable
        },
        {
            src: 'primes_salaires_net',
            fn: salaireNetToImposable
        },
        {
            src: 'indemnite_fin_contrat_net',
            fn: salaireNetToImposable
        }
    ],
    salaire_net: ['salaire_net_hors_revenus_exceptionnels', 'primes_salaires_net', 'indemnite_fin_contrat_net'],
};

function computeRessources(mesAidesIndividu, openFiscaIndividu) {
    _.forEach(individuRessources, function(sourceDefinitions, outputKey) {

        openFiscaIndividu[outputKey] = openFiscaIndividu[outputKey] || {};
        var result = openFiscaIndividu[outputKey];
        _.forEach(sourceDefinitions, function(definition) {
            var srcKey = definition.src || definition;
            var fn = definition.fn || function(x) { return x; };

            _.forEach(mesAidesIndividu[srcKey], function(value, period) {
                result[period] = result[period] || 0;
                result[period] += fn(value);
            });
        });

        if (! Object.keys(openFiscaIndividu[outputKey]).length) {
            delete openFiscaIndividu[outputKey];
        }
    });
}

module.exports = {
    computeRessources: computeRessources,
    computedRessources: individuRessources,
};
