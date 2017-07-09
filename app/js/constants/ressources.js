'use strict';

angular.module('ddsCommon').constant('ressourceCategories', [
    {
        id: 'revenusActivite',
        label: 'Revenus d’activité'
    },
    {
        id: 'allocations',
        label: 'Allocations'
    },
    {
        id: 'indemnites',
        label: 'Indemnités'
    },
    {
        id: 'pensions',
        label: 'Pensions'
    },
    {
        id: 'rpns',
        label: 'Revenus professionnels non salariés'
    },
    {
        id: 'patrimoine',
        label: 'Revenus du patrimoine'
    },
    {
        id: 'autre',
        label: 'Autres'
    }
]);

angular.module('ddsCommon').constant('ressourceTypes', [
    {
        id: 'salaire_net_hors_revenus_exceptionnels',
        label: 'Salaire (hors primes)',
        category: 'revenusActivite',
        interuptionQuestionLabel: 'un salaire, des allocations chômage, ou des indemnités de la sécurité sociale',
        positionInList: '1'
    },
    {
        id: 'primes_salaires_net',
        label: 'Primes (dont 13ème mois)',
        category: 'revenusActivite',
        positionInList: '2',
        prefix: 'des',
        revenuExceptionnel: true,
    },
    {
        id: 'indemnites_stage',
        label: 'Rémunération de stage',
        category: 'revenusActivite',
        prefix: 'une'
    },
    {
        id: 'revenus_stage_formation_pro',
        label: 'Revenus de stage de formation professionnelle',
        category: 'revenusActivite',
        prefix: 'des'
    },
    {
        id: 'chomage_net',
        label: 'Allocations chômage (ARE)',
        category: 'allocations',
        interuptionQuestionLabel: 'des allocations chômage, un salaire ou des indemnités de la sécurité sociale'
    },
    {
        id: 'allocation_securisation_professionnelle',
        label: 'Allocation de sécurisation professionnelle',
        category: 'allocations',
        prefix: 'une'
    },
    {
        id: 'prime_forfaitaire_mensuelle_reprise_activite',
        label: 'Prime forfaitaire mensuelle pour la reprise d’activité',
        category: 'allocations',
        prefix: 'une'
    },
    {
        id: 'aide_logement',
        label: 'Aides au logement (APL, ALS, ALF)',
        category: 'allocations',
        prefix: 'des'
    },
    {
        id: 'af',
        label: 'Allocations familiales',
        category: 'allocations',
        prefix: 'des'
    },
    {
        id: 'cf',
        label: 'Complément familial (CF)',
        category: 'allocations',
        prefix: 'le'
    },
    {
        id: 'asf',
        label: 'Allocation de soutien familial (ASF)',
        category: 'allocations',
        prefix: 'l’'
    },
    {
        id: 'rsa',
        label: 'Revenu de solidarité active (RSA)',
        category: 'allocations',
        prefix: 'le'
    },
    {
        id: 'ppa',
        label: 'Prime d’activité',
        category: 'revenusActivite',
        prefix: 'la'
    },
    {
        id: 'aspa',
        label: 'Allocation de solidarité aux personnes âgées (ASPA)',
        category: 'allocations',
        prefix: 'l’'
    },
    {
        id: 'asi',
        label: 'Allocation supplémentaire d’invalidité (ASI)',
        category: 'allocations',
        prefix: 'l’'
    },
    {
        id: 'ass',
        label: 'Allocation de solidarité spécifique (ASS)',
        category: 'allocations',
        prefix: 'l’'

    },
    {
        id: 'aah',
        label: 'Allocation adulte handicapé (AAH)',
        category: 'allocations',
        prefix: 'l’'
    },
    {
        id: 'caah',
        label: 'Complément à l’Allocation adulte handicapé (AAH)',
        category: 'allocations',
        prefix: 'le'
    },
    {
        id: 'mva',
        label: 'Majoration pour vie autonome (MVA)',
        category: 'allocations',
        prefix: 'la'
    },
    {
        id: 'aeeh',
        label: 'Allocation d’éducation de l’enfant handicapé (AEEH)',
        category: 'allocations',
        prefix: 'l’'  // We don't actually need to capture the amount, but users want to declare it, and presence can improve some Paris aides. See https://github.com/sgmap/mes-aides-ui/issues/191
    },
    {
        id: 'pch',
        label: 'Prestation de compensation du handicap (PCH)',
        category: 'allocations',
        prefix: 'la'
    },
    {
        id: 'paje_base',
        label: 'Prestation d’accueil du jeune enfant (PAJE) - Allocation de base',
        category: 'allocations',
        prefix: 'la'
    },
    {
        id: 'paje_clca',
        label: 'Complément de libre choix d’activité (CLCA)',
        category: 'allocations',
        prefix: 'le'
    },
    {
        id: 'paje_prepare',
        label: 'Prestation partagée d’éducation de l’enfant (PreParE)',
        category: 'allocations',
        prefix: 'la'
    },
    {
        id: 'indemnites_journalieres_maternite',
        label: 'Indemnités de maternité, paternité, adoption',
        category: 'indemnites',
        interuptionQuestionLabel: 'des indemnités de la sécurité sociale, un salaire ou des allocations chômage'
    },
    {
        id: 'indemnites_journalieres_maladie',
        label: 'Indemnités maladie',
        category: 'indemnites',
        interuptionQuestionLabel: 'des indemnités de la sécurité sociale, un salaire ou des allocations chômage'
    },
    {
        id: 'indemnites_journalieres_maladie_professionnelle',
        label: 'Indemnités maladie professionnelle',
        category: 'indemnites',
        interuptionQuestionLabel: 'des indemnités de la sécurité sociale, un salaire ou des allocations chômage'
    },
    {
        id: 'indemnites_journalieres_accident_travail',
        label: 'Indemnités d’accident du travail',
        category: 'indemnites',
        interuptionQuestionLabel: 'des indemnités de la sécurité sociale, un salaire ou des allocations chômage'
    },
    {
        id: 'indemnites_chomage_partiel',
        label: 'Indemnités d’activité partielle',
        category: 'indemnites',
        prefix: 'des'
    },
    {
        id: 'indemnites_volontariat',
        label: 'Indemnités de volontariat',
        category: 'indemnites',
        prefix: 'des'
    },
    {
        id: 'indemnite_fin_contrat_net',
        label: 'Indemnités de licenciement, rupture, fin de CDD…',
        category: 'revenusActivite',
        prefix: 'des',
        revenuExceptionnel: true,
    },
    {
        id: 'dedommagement_victime_amiante',
        label: 'Dédommagement aux victimes de l’amiante',
        category: 'indemnites',
        prefix: 'un'
    },
    {
        id: 'pensions_alimentaires_percues',
        label: 'Pension alimentaire',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'pensions_alimentaires_versees_individu',
        label: 'Pension alimentaire versée',
        category: 'pensions',
        interuptionQuestionLabel: 'une pension alimentaire',
    },
    {
        id: 'prestation_compensatoire',
        label: 'Prestation compensatoire (suite à séparation)',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'retraite_nette',
        label: 'Retraite (y compris reversion), rente',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'retraite_combattant',
        label: 'Retraite du combattant',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'pensions_invalidite',
        label: 'Pension d’invalidité',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'bourse_enseignement_sup',
        label: 'Bourse de l’enseignement supérieur',
        category: 'autre',
        prefix: 'une'
    },
    {
        id: 'bourse_recherche',
        label: 'Bourse de recherche',
        category: 'autre',
        prefix: 'une'
    },
    {
        id: 'gains_exceptionnels',
        label: 'Gains exceptionnels (dons, gains aux jeux, héritage)',
        category: 'autre',
        prefix: 'des'
    },
    {
        id: 'revenus_locatifs',
        label: 'Revenus locatifs (terrains, appartements, SCI…)',
        category: 'patrimoine',
        prefix: 'des'
    },
    {
        id: 'revenus_capital',
        label: 'Revenus du capital (intérêts, plus-values, dividendes…)',
        category: 'patrimoine',
        prefix: 'des'
    },
    {
        id: 'tns_micro_entreprise_chiffre_affaires',
        label: 'Micro-entreprise',
        category: 'rpns',
        isMontantAnnuel: true
    },
    {
        id: 'tns_auto_entrepreneur_chiffre_affaires',
        label: 'Auto-entrepreneur',
        category: 'rpns'
    },
    {
        id: 'tns_benefice_exploitant_agricole',
        label: 'Exploitant agricole',
        category: 'rpns',
        isMontantAnnuel: true
    },
    {
        id: 'tns_autres_revenus',
        label: 'Profession libérale, entrepreneur',
        category: 'rpns',
        isMontantAnnuel: true
    }
]);

angular.module('ddsCommon').constant('categoriesRnc', [
    {
        id: 'salaire_imposable_ym2',
        label: 'Revenus d’activité connus',
        sources: ['salaire_net_hors_revenus_exceptionnels']
    },
    {
        id: 'chomage_imposable',
        label: 'Autres revenus imposables (préretraite, chômage)',
        sources: ['chomage_net']
    },
    {
        id: 'retraite_imposable',
        label: 'Pensions, retraites, rentes',
        sources: ['retraite_nette', 'retraite_combattant', 'pensions_invalidite']
    },
    {
        id: 'frais_reels',
        label: 'Frais réels déductibles'
    },
    {
        id: 'pensions_alimentaires_percues_ym2',
        label: 'Pensions alimentaires reçues',
        sources: ['pensions_alimentaires_percues'],
    },
    {
        id: 'pensions_alimentaires_versees_ym2',
        label: 'Pensions alimentaires versées',
        sources: ['pensions_alimentaires_versees_individu']
    }
]);

var TAUX_CSG_CRDS = 0.029,
    ASSIETTE_COTIS = 0.9825,
    RATIO_NET_BRUT = 0.78;

function salaireNetToBrut(value) {
    return value / RATIO_NET_BRUT;
}

function salaireNetToImposable(value) {
    return value + TAUX_CSG_CRDS * ASSIETTE_COTIS * value / RATIO_NET_BRUT;
}


var foyerFiscalMapping = {
    pensions_alimentaires_versees: {
        src: 'pensions_alimentaires_versees_ym2',
        fn: function(value) { return -value; }
    }
};

var individuMapping = {
    aah: 'aah',
    allocation_securisation_professionnelle: 'allocation_securisation_professionnelle',
    bourse_enseignement_sup: 'bourse_enseignement_sup',
    bourse_recherche: 'bourse_recherche',
    caah: 'caah',
    chomage_brut: {
        src: 'chomage_net',
        fn: function(value) {
            return value / (1 - (((0.062 + 0.005) * 0.9825) + 0.028));
        }
    },
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
    pensions_alimentaires_percues: ['pensions_alimentaires_percues', 'pensions_alimentaires_percues_ym2'],
    pensions_alimentaires_versees_individu: 'pensions_alimentaires_versees_individu',
    pensions_invalidite: 'pensions_invalidite',
    prestation_compensatoire: 'prestation_compensatoire',
    prime_forfaitaire_mensuelle_reprise_activite: 'prime_forfaitaire_mensuelle_reprise_activite',
    retraite_brute: {
        src: 'retraite_nette',
        fn: function(value) {
            // approximation prélèvement moyen de 7.4 % de cotisations sociales (csg-crds)
            return value / 0.926;
        }
    },
    retraite_combattant: 'retraite_combattant',
    retraite_nette: 'retraite_nette',
    revenus_capital: 'revenus_capital',
    revenus_locatifs: 'revenus_locatifs',
    revenus_stage_formation_pro: 'revenus_stage_formation_pro',
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
        'salaire_imposable_ym2'
    ],
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

var ressourceMapping = {
    foyerFiscal : foyerFiscalMapping,
    individu: individuMapping,
};

angular.module('ddsCommon').constant('ressourceMapping', ressourceMapping);
