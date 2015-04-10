'use strict';

angular.module('ddsCommon').constant('droitsDescription', [
    {
        'id':'cmu_c',
        'hasMontant':false,
        'label':'Couverture Maladie Universelle Complémentaire',
        'shortLabel':'CMU-C',
        'description':'La CMU-C est une protection complémentaire santé gratuite accordée aux personnes remplissant certaines conditions de résidence et de ressources.',
        'imgSrc':'logo_cmu.png',
        'link':'http://www.cmu.fr/cmu-complementaire.php'
    },
    {
        'id':'acs',
        'isMontantAnnuel':true,
        'label':'Aide pour une Complémentaire Santé',
        'shortLabel':'ACS',
        'description':'L’aide pour l’acquisition d’une assurance complémentaire santé, dite ACS, est une aide financière pour payer une complémentaire santé (exemple : une mutuelle).',
        'imgSrc':'logo_cmu.png',
        'link':'http://www.cmu.fr/acs.php'
    },
    {
        'id':'aspa',
        'label':'Allocation de Solidarité aux Personnes Âgées',
        'shortLabel':'ASPA',
        'description':'L’allocation de solidarité aux personnes âgées (Aspa) est une allocation destinée aux personnes âgées disposant de faibles revenus en vue de leur assurer un niveau minimum de ressources. Elle remplace le minimum vieillesse depuis 2006.',
        'imgSrc':'logo_aspa.png',
        'link':'http://vosdroits.service-public.fr/particuliers/F16871.xhtml'
    },
    {
        'id':'asi',
        'label':'Allocation Supplémentaire d’Invalidité',
        'shortLabel':'ASI',
        'description':'L’allocation supplémentaire d’invalidité (Asi) est une prestation versée sous certaines conditions aux personnes invalides titulaires d’une pension de retraite ou d’invalidité qui n’ont pas atteint l’âge légal de départ à la retraite pour bénéficier de l’allocation de solidarité aux personnes âgées (Aspa)',
        'imgSrc':'logo_aspa.png',
        'link':'http://vosdroits.service-public.fr/particuliers/F16940.xhtml'
    },
    {
        'id':'af',
        'label':'Allocations Familiales',
        'shortLabel':'AF',
        'description':'Les allocations familiales sont versées, sans condition de ressources, aux personnes ayant au moins 2 enfants de moins de 20 ans à charge. Le montant des prestations dépend du nombre d’enfants à charge et de leur âge.',
        'imgSrc':'logo_caf.png',
        'link':'http://www.caf.fr/aides-et-services/s-informer-sur-les-aides/petite-enfance/les-allocations-familiales-af-0'
    },
    {
        'id':'cf',
        'label':'Complément Familial',
        'shortLabel':'CF',
        'description':'Le complément familial est versé, sous certaines conditions, aux personnes ayant au moins 3 enfants à charge.',
        'imgSrc':'logo_caf.png',
        'link':'http://www.caf.fr/aides-et-services/s-informer-sur-les-aides/enfance-et-jeunesse/le-complement-familialcf',
        'isBaseRessourcesYearMoins2':true
    },
    {
        'id':'asf',
        'label':'Allocation de Soutien Familial',
        'shortLabel':'ASF',
        'description':'L’ASF est versée par la CAF ou la MSA au parent qui élève seul son enfant ou à la personne qui a recueilli un enfant, qu’elle vive seule ou en couple.',
        'imgSrc':'logo_caf.png',
        'link':'http://vosdroits.service-public.fr/particuliers/F815.xhtml'
    },
    {
        'id':'paje_base',
        'label':'Prestation d’Accueil du Jeune Enfant - Allocation de base',
        'shortLabel':'PAJE-BASE',
        'description': 'L’allocation de base vous aide à assurer les dépenses liées à l’entretien et à l’éducation de votre enfant.',
        'imgSrc':'logo_caf.png',
        'link':'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/petite-enfance/l-allocation-de-base',
        'isBaseRessourcesYearMoins2':true
    },
    {
        'id':'rsa',
        'label':'Revenu de Solidarité Active',
        'shortLabel':'RSA',
        'description':'Le RSA est destiné à assurer aux personnes disposant de faibles ressources un niveau minimum de revenu variable selon la composition de leur foyer.',
        'imgSrc':'logo_rsa.png',
        'link':'http://vosdroits.service-public.fr/particuliers/N19775.xhtml'
    },
    {
        'id':'aide_logement',
        'label':'Aide au Logement',
        'shortLabel':'AL',
        'description':'L\'aide au logement est une aide financière destinée à réduire le montant de votre loyer ou votre mensualité d’emprunt immobilier. Elle est attribuée selon la nature de votre logement et la composition de votre famille.',
        'imgSrc':'logo_caf.png',
        'link':'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/logement-et-cadre-de-vie/les-aides-au-logement-0',
        'isBaseRessourcesYearMoins2':true,
        'montantInconnuDisclaimer': 'Votre situation ne nous permet pas de calculer le montant de l\'aide au logement.<br>Le <a target="_blank" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la caf</a> pourra mieux vous renseigner.'
    },
    {
        'id':'apl',
        'shortLabel':'APL',
        'isSimulated': false
    },
    {
        'id':'alf',
        'shortLabel':'ALF',
        'isSimulated': false
    },
    {
        'id':'als',
        'shortLabel':'ALS',
        'isSimulated': false
    },
    {
        'id':'ass',
        'label':'Allocation de Solidarité Spécifique',
        'shortLabel':'ASS',
        'description':'L’allocation de solidarité spécifique (ASS) est une aide financière destinée aux personnes ayant épuisé leurs droits aux allocations chômage.',
        'imgSrc':'logo_ass.png',
        'link':'http://vosdroits.service-public.fr/particuliers/F12484.xhtml'
    },
    {
        'id':'bourse_college',
        'isMontantAnnuel':true,
        'label':'Bourse de collège',
        'shortLabel':'Bourse collège',
        'description':'La bourse des collèges est une aide destinée à favoriser la scolarité des collégiens. Elle est versée sous conditions de ressources.',
        'imgSrc':'logo_education_nationale.png',
        'link':'http://www.education.gouv.fr/cid88/les-aides-financieres-au-college.html#Les%20bourses%20de%20coll%C3%A8ge',
        'isBaseRessourcesYearMoins2':true
    },
    {
        'id':'bourse_lycee',
        'isMontantAnnuel':true,
        'label':'Bourse de lycée',
        'shortLabel':'Bourse lycée',
        'description':'La bourse des lycées est accordée, sous condition de ressources, à la famille d’un lycéen. Son montant dépend des ressources et des charges de la famille. Cette bourse peut être accompagnée de diverses primes (prime d’équipement, prime à la qualification, bourse au mérite au lycée, prime à l’internat...).',
        'imgSrc':'logo_education_nationale.png',
        'link':'http://www.education.gouv.fr/cid151/aides-financieres-au-lycee.html#Les%20bourses%20de%20lycée',
        'isBaseRessourcesYearMoins2':true
    }
]);
