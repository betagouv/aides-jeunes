(function() {
'use strict';

var ressourceCategories = [
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
];

var ressourceTypes = [
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
        prefix: 'des',
        entity: 'famille'
    },
    {
        id: 'af',
        label: 'Allocations familiales',
        category: 'allocations',
        prefix: 'des',
        entity: 'famille'
    },
    {
        id: 'cf',
        label: 'Complément familial (CF)',
        category: 'allocations',
        prefix: 'le',
        entity: 'famille'
    },
    {
        id: 'asf',
        label: 'Allocation de soutien familial (ASF)',
        category: 'allocations',
        prefix: 'l’',
        entity: 'famille'
    },
    {
        id: 'rsa',
        label: 'Revenu de solidarité active (RSA)',
        category: 'allocations',
        prefix: 'le',
        entity: 'famille'
    },
    {
        id: 'ppa',
        label: 'Prime d’activité',
        category: 'revenusActivite',
        prefix: 'la',
        entity: 'famille'
    },
    {
        id: 'aspa',
        label: 'Allocation de solidarité aux personnes âgées (ASPA)',
        category: 'allocations',
        prefix: 'l’',
        entity: 'famille'
    },
    {
        id: 'asi',
        label: 'Allocation supplémentaire d’invalidité (ASI)',
        category: 'allocations',
        prefix: 'l’',
        entity: 'famille'
    },
    {
        id: 'ass',
        label: 'Allocation de solidarité spécifique (ASS)',
        category: 'allocations',
        prefix: 'l’',
        entity: 'famille'
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
        prefix: 'l’',  // We don't actually need to capture the amount, but users want to declare it, and presence can improve some Paris aides. See https://github.com/sgmap/mes-aides-ui/issues/191
        entity: 'famille'
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
        prefix: 'la',
        entity: 'famille'
    },
    {
        id: 'paje_clca',
        label: 'Complément de libre choix d’activité (CLCA)',
        category: 'allocations',
        prefix: 'le',
        entity: 'famille'
    },
    {
        id: 'paje_prepare',
        label: 'Prestation partagée d’éducation de l’enfant (PreParE)',
        category: 'allocations',
        prefix: 'la',
        entity: 'famille'
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
];

var categoriesRnc = [
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
];


/* Export either through Angular loader or CommonJS */
if (typeof module != 'undefined' && typeof angular === 'undefined') {  // we're in Node
    module.exports = {
        ressourceCategories: ressourceCategories,
        ressourceTypes: ressourceTypes,
        categoriesRnc: categoriesRnc
    };
} else {  // we're in the browser
    angular.module('ddsCommon').constant('ressourceCategories', ressourceCategories);
    angular.module('ddsCommon').constant('ressourceTypes', ressourceTypes);
    angular.module('ddsCommon').constant('categoriesRnc', categoriesRnc);
}
/* End of export */
})();
