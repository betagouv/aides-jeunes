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

var ijssInteruptionQuestionLabel = 'des indemnités de la sécurité sociale, un salaire ou des allocations chômage';

angular.module('ddsCommon').constant('ressourceTypes', [
    {
        id: 'revenusSalarie',
        label: 'Salaire, primes',
        category: 'revenusActivite',
        interuptionQuestionLabel: 'un salaire, des allocations chômage, ou des indemnités de la sécurité sociale',
        positionInList: '1'
    },
    {
        id: 'stage',
        label: 'Rémunération de stage',
        category: 'revenusActivite',
        prefix: 'une'
    },
    {
        id: 'revenusStageFormationPro',
        label: 'Revenus de stage de formation professionnelle',
        category: 'revenusActivite',
        prefix: 'des'
    },
    {
        id: 'allocationsChomage',
        label: 'Allocations chômage (ARE)',
        category: 'allocations',
        interuptionQuestionLabel: 'des allocations chômage, un salaire ou des indemnités de la sécurité sociale'
    },
    {
        id: 'allocationSecurisationPro',
        label: 'Allocation de sécurisation professionnelle',
        category: 'allocations',
        prefix: 'une'
    },
    {
        id: 'primeRepriseActivite',
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
        id: 'primeActivite',
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
        id: 'complementAAH',
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
        category: 'allocations'
    },
    {
        id: 'paje_base',
        label: 'Prestation d’accueil du jeune enfant (PAJE) - Allocation de base',
        category: 'allocations',
        prefix: 'la'
    },
    {
        id: 'clca',
        label: 'Complément de libre choix d’activité (CLCA)',
        category: 'allocations',
        prefix: 'le'
    },
    {
        id: 'prepare',
        label: 'Prestation partagée d’éducation de l’enfant (PreParE)',
        category: 'allocations',
        prefix: 'la'
    },
    {
        id: 'indJourMaternite',
        label: 'Indemnités de maternité, paternité, adoption',
        category: 'indemnites',
        interuptionQuestionLabel: ijssInteruptionQuestionLabel
    },
    {
        id: 'indJourMaladie',
        label: 'Indemnités maladie',
        category: 'indemnites',
        interuptionQuestionLabel: ijssInteruptionQuestionLabel
    },
    {
        id: 'indJourMaladieProf',
        label: 'Indemnités maladie professionnelle',
        category: 'indemnites',
        interuptionQuestionLabel: ijssInteruptionQuestionLabel
    },
    {
        id: 'indJourAccidentDuTravail',
        label: 'Indemnités d’accident du travail',
        category: 'indemnites',
        interuptionQuestionLabel: ijssInteruptionQuestionLabel
    },
    {
        id: 'indChomagePartiel',
        label: 'Indemnités d’activité partielle',
        category: 'indemnites',
        prefix: 'des'
    },
    {
        id: 'indVolontariat',
        label: 'Indemnités de volontariat',
        category: 'indemnites',
        prefix: 'des'
    },
    {
        id: 'dedommagementAmiante',
        label: 'Dédommagement aux victimes de l’amiante',
        category: 'indemnites',
        prefix: 'un'
    },
    {
        id: 'pensionsAlimentaires',
        label: 'Pension alimentaire',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'pensionsAlimentairesVersees',
        label: 'Pension alimentaire versée',
        category: 'pensions',
        interuptionQuestionLabel: 'une pension alimentaire',
    },
    {
        id: 'prestationCompensatoire',
        label: 'Prestation compensatoire (suite à séparation)',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'pensionsRetraitesRentes',
        label: 'Retraite (y compris reversion), rente',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'retraiteCombattant',
        label: 'Retraite du combattant',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'pensionsInvalidite',
        label: 'Pension d’invalidité',
        category: 'pensions',
        prefix: 'une'
    },
    {
        id: 'bourseEnseignementSup',
        label: 'Bourse de l’enseignement supérieur',
        category: 'autre',
        prefix: 'une'
    },
    {
        id: 'bourseRecherche',
        label: 'Bourse de recherche',
        category: 'autre',
        prefix: 'une'
    },
    {
        id: 'gainsExceptionnels',
        label: 'Gains exceptionnels (dons, gains aux jeux, héritage)',
        category: 'autre',
        prefix: 'des'
    },
    {
        id: 'revenusLocatifs',
        label: 'Revenus locatifs (terrains, appartements, SCI…)',
        category: 'patrimoine',
        prefix: 'des'
    },
    {
        id: 'revenusDuCapital',
        label: 'Revenus du capital (intérêts, plus-values, dividendes…)',
        category: 'patrimoine',
        prefix: 'des'
    },
    {
        id: 'caMicroEntreprise',
        label: 'Micro-entreprise',
        category: 'rpns',
        isMontantAnnuel: true
    },
    {
        id: 'caAutoEntrepreneur',
        label: 'Auto-entrepreneur',
        category: 'rpns'
    },
    {
        id: 'revenusAgricolesTns',
        label: 'Exploitant agricole',
        category: 'rpns',
        isMontantAnnuel: true
    },
    {
        id: 'autresRevenusTns',
        label: 'Profession libérale, entrepreneur',
        category: 'rpns',
        isMontantAnnuel: true
    }
]);

angular.module('ddsCommon').constant('categoriesRnc', [
    {
        id: 'rncRevenusActivite',
        label: 'Revenus d’activité connus'
    },
    {
        id: 'rncAutresRevenus',
        label: 'Autres revenus imposables (préretraite, chômage)'
    },
    {
        id: 'rncPensionsRetraitesRentes',
        label: 'Pensions, retraites, rentes'
    },
    {
        id: 'fraisReelsDeductibles',
        label: 'Frais réels déductibles'
    },
    {
        id: 'rncPensionsAlimentaires',
        label: 'Pensions alimentaires reçues'
    },
    {
        id: 'rncPensionsAlimentairesVersees',
        label: 'Pensions alimentaires versées'
    }
]);
