
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
    chomage_brut: {
        src: 'chomage_net',
        fn: function(value) {
            return value / (1 - (((0.062 + 0.005) * 0.9825) + 0.028));
        }
    },
    retraite_brute: {
        src: 'retraite_nette',
        fn: function(value) {
            // approximation prélèvement moyen de 7.4 % de cotisations sociales (csg-crds)
            return value / 0.926;
        }
    },
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
        },
        'salaire_imposable'
    ],

    aah: 'aah',
    allocation_securisation_professionnelle: 'allocation_securisation_professionnelle',
    bourse_enseignement_sup: 'bourse_enseignement_sup',
    bourse_recherche: 'bourse_recherche',
    caah: 'caah',
    chomage_net: 'chomage_net',
    dedommagement_victime_amiante: 'dedommagement_victime_amiante',
    gains_exceptionnels: 'gains_exceptionnels',
    indemnites_chomage_partiel: 'indemnites_chomage_partiel',
    indemnites_journalieres_accident_travail: 'indemnites_journalieres_accident_travail',
    indemnites_journalieres_maladie: 'indemnites_journalieres_maladie',
    indemnites_journalieres_maladie_professionnelle: 'indemnites_journalieres_maladie_professionnelle',
    indemnites_journalieres_maternite: 'indemnites_journalieres_maternite',
    indemnites_stage: 'indemnites_stage',
    indemnites_volontariat: 'indemnites_volontariat',
    indemnite_fin_contrat_net: 'indemnite_fin_contrat_net',
    mva: 'mva',
    pch: 'pch',
    pensions_alimentaires_percues: 'pensions_alimentaires_percues',
    pensions_alimentaires_versees_individu: 'pensions_alimentaires_versees_individu',
    pensions_invalidite: 'pensions_invalidite',
    prestation_compensatoire: 'prestation_compensatoire',
    prime_forfaitaire_mensuelle_reprise_activite: 'prime_forfaitaire_mensuelle_reprise_activite',
    retraite_combattant: 'retraite_combattant',
    retraite_nette: 'retraite_nette',
    revenus_capital: 'revenus_capital',
    revenus_locatifs: 'revenus_locatifs',
    revenus_stage_formation_pro: 'revenus_stage_formation_pro',
    salaire_net: ['salaire_net_hors_revenus_exceptionnels', 'primes_salaires_net', 'indemnite_fin_contrat_net'],
    primes_salaires_net: 'primes_salaires_net',
    tns_auto_entrepreneur_chiffre_affaires: 'tns_auto_entrepreneur_chiffre_affaires',
    tns_autres_revenus: 'tns_autres_revenus',
    tns_benefice_exploitant_agricole: 'tns_benefice_exploitant_agricole',
    tns_micro_entreprise_chiffre_affaires: 'tns_micro_entreprise_chiffre_affaires',

    // ressourcesYearMoins2Captured
    chomage_imposable: 'chomage_imposable',
    retraite_imposable: 'retraite_imposable',
    frais_reels: 'frais_reels',
    pensions_alimentaires_versees: 'pensions_alimentaires_versees',

    // famille ressources
    aeeh: 'aeeh',
    af: 'af',
    aide_logement: 'aide_logement',
    asf: 'asf',
    asi: 'asi',
    aspa: 'aspa',
    ass: 'ass',
    cf: 'cf',
    paje_base: 'paje_base',
    paje_clca: 'paje_clca',
    paje_prepare: 'paje_prepare',
    ppa: 'ppa',
    rsa: 'rsa',
};


module.exports = {
    individu: individuRessources,
};
