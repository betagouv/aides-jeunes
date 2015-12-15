'use strict';

angular.module('ddsCommon').constant('droitsDescription', {
    'cmu_c': {
        'id': 'cmu_c',
        'label': 'Couverture Maladie Universelle Complémentaire',
        'shortLabel': 'CMU-C',
        'description': 'La CMU-C est une protection complémentaire santé gratuite.',
        'conditions': [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
        ],
        'imgSrc': 'logo_cmu.png',
        'link': 'http://www.cmu.fr/cmu-complementaire.php'
    },
    'acs': {
        'id': 'acs',
        'isMontantAnnuel': true,
        'label': 'Aide pour une Complémentaire Santé',
        'shortLabel': 'ACS',
        'description': 'L’aide pour l’acquisition d’une assurance complémentaire santé, dite ACS, est une aide financière pour payer une complémentaire santé (exemple : une mutuelle).',
        'conditions': [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
        ],
        'imgSrc': 'logo_cmu.png',
        'link': 'http://www.cmu.fr/acs.php'
    },
    'aspa': {
        'id': 'aspa',
        'label': 'Allocation de Solidarité aux Personnes Âgées',
        'shortLabel': 'ASPA',
        'description': 'L’allocation de solidarité aux personnes âgées (Aspa) est une allocation destinée aux personnes âgées disposant de faibles revenus en vue de leur assurer un niveau minimum de ressources. Elle remplace le minimum vieillesse depuis 2006.',
        'conditions': [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
            'Avoir demandé toutes les retraites (générale, réversion, complémentaire…) auxquelles vous avez droit.',
            'Votre conjoint doit avoir demandé toutes les retraites (générale, réversion, complémentaire…) auxquelles il ou elle a droit.'
        ],

        'imgSrc': 'logo_aspa.png',
        'link': 'http://vosdroits.service-public.fr/particuliers/F16871.xhtml'
    },
    'asi': {
        'id': 'asi',
        'label': 'Allocation Supplémentaire d’Invalidité',
        'shortLabel': 'ASI',
        'description': 'L’allocation supplémentaire d’invalidité (Asi) est une prestation versée sous certaines conditions aux personnes invalides titulaires d’une pension de retraite ou d’invalidité qui n’ont pas atteint l’âge légal de départ à la retraite pour bénéficier de l’allocation de solidarité aux personnes âgées (Aspa)',
        'imgSrc': 'logo_aspa.png',
        'link': 'http://vosdroits.service-public.fr/particuliers/F16940.xhtml'
    },
    'af': {
        'id': 'af',
        'label': 'Allocations Familiales',
        'shortLabel': 'AF',
        'description': 'Les allocations familiales sont versées aux personnes ayant au moins 2 enfants de moins de 20 ans à charge. Le montant des prestations dépend du nombre d’enfants à charge, de leur âge et des ressources de la famille.',
        'conditions': [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.'
        ],
        'imgSrc': 'logo_caf.png',
        'link': 'http://www.caf.fr/aides-et-services/s-informer-sur-les-aides/petite-enfance/les-allocations-familiales-af-0',
        'isBaseRessourcesYearMoins2': true
    },
    'cf': {
        'id': 'cf',
        'label': 'Complément Familial',
        'shortLabel': 'CF',
        'description': 'Le complément familial est versé, sous certaines conditions, aux personnes ayant au moins 3 enfants à charge.',
        'imgSrc': 'logo_caf.png',
        'link': 'http://www.caf.fr/aides-et-services/s-informer-sur-les-aides/enfance-et-jeunesse/le-complement-familialcf',
        'isBaseRessourcesYearMoins2': true
    },
    'asf': {
        'id': 'asf',
        'label': 'Allocation de Soutien Familial',
        'shortLabel': 'ASF',
        'description': 'L’ASF est versée par la CAF ou la MSA au parent qui élève seul son enfant ou à la personne qui a recueilli un enfant, qu’elle vive seule ou en couple.',
        'conditions': [
            'Ne pas toucher l’intégralité d’une pension alimentaire qui vous aurait été attribuée par une décision de justice, ou que cette pension soit d’un montant inférieur à celui de l’ASF.'
        ],
        'imgSrc': 'logo_caf.png',
        'link': 'http://vosdroits.service-public.fr/particuliers/F815.xhtml'
    },
    'paje_base': {
        'id': 'paje_base',
        'label': 'Prestation d’Accueil du Jeune Enfant - Allocation de base',
        'shortLabel': 'PAJE-BASE',
        'description': 'L’allocation de base vous aide à assurer les dépenses liées à l’entretien et à l’éducation de votre enfant.',
        'imgSrc': 'logo_caf.png',
        'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/petite-enfance/l-allocation-de-base',
        'isBaseRessourcesYearMoins2': true
    },
    'rsa': {
        'id': 'rsa',
        'label': 'Revenu de Solidarité Active',
        'shortLabel': 'RSA',
        'description': 'Le RSA est destiné à assurer aux personnes disposant de faibles ressources un niveau minimum de revenu variable selon la composition de leur foyer.',
        'conditions': [
            'Résider en France plus de 9 mois par an.',
            'Si vous êtes ressortissant.e d’un pays de l’UE, de l’EEE ou Suisse, résider en France depuis plus de 3 mois.',
            'Si vous êtes ressortissant.e d’un autre pays, résider en France depuis plus de 5 ans.'
        ],
        'imgSrc': 'logo_rsa.png',
        'link': 'http://vosdroits.service-public.fr/particuliers/N19775.xhtml',
        'uncomputability': {
            'tns': {
                'reason': 'vous avez des revenus en tant qu’indépendant.e',
                'solution': 'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a title="Article R262-23 du code de l’action sociale" href="http://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont vos revenus non salariés impacteront le montant de votre aide.'
            },
            'conjoint_tns': {
                'reason': 'votre conjoint.e a des revenus en tant qu’indépendant.e',
                'solution': 'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a title="Article R262-23 du code de l’action sociale" href="http://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont les revenus non salariés de votre conjoint.e impacteront le montant de votre aide.'
            }
        }
    },
    'aide_logement': {
        'id': 'aide_logement',
        'label': 'Aides au Logement',
        'shortLabel': 'AL',
        'description': 'L’aide au logement est une aide financière destinée à réduire le montant de votre loyer ou votre mensualité d’emprunt immobilier. Elle est attribuée selon la nature de votre logement et la composition de votre famille.',
        'conditions': [
            'Résider au moins 8 mois par an dans le logement que vous avez décrit.',
            'Le logement doit être <a href="http://www.caf.fr/aides-et-services/connaitre-vos-droits-selon-votre-situation/vous-louez-ou-vous-achetez-un-logement/vous-occupez-un-logement-insalubre-ou-non-decent" title="9 mètres carrés par personne, fenêtre, WC, eau potable, électricité" >décent</a>.'
        ],
        'imgSrc': 'logo_caf.png',
        'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/logement-et-cadre-de-vie/les-aides-au-logement-0',
        'isBaseRessourcesYearMoins2': true,
        'uncomputability': {
            'primo_accedant': {
                'reason': 'vous êtes <abbr title="Non propriétaire de votre résidence principale dans les deux années précédant l’achat de votre résidence actuelle">primo-accédant</abbr> à la propriété de votre résidence principale',
                'solution': 'Le <a href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> pourra estimer vos droits sur la base de la valeur de votre bien.'
            },
            'locataire_foyer': {
                'reason': 'vous logez dans un foyer',
                'solution': 'Le <a href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> vous donnera des estimations selon les différentes conventions possibles de votre foyer.'
            }

        }
    },
    'ass': {
        'id': 'ass',
        'label': 'Allocation de Solidarité Spécifique',
        'shortLabel': 'ASS',
        'description': 'L’allocation de solidarité spécifique (ASS) est une aide financière destinée aux personnes ayant épuisé leurs droits aux allocations chômage.',
        'imgSrc': 'logo_ass.png',
        'link': 'http://vosdroits.service-public.fr/particuliers/F12484.xhtml'
    },
    'bourse_college': {
        'id': 'bourse_college',
        'isMontantAnnuel': true,
        'label': 'Bourse de collège',
        'shortLabel': 'Bourse collège',
        'description': 'La bourse des collèges est une aide destinée à favoriser la scolarité des collégiens. Elle est versée sous conditions de ressources.',
        'imgSrc': 'logo_education_nationale.png',
        'link': 'http://www.education.gouv.fr/cid88/les-aides-financieres-au-college.html#Les%20bourses%20de%20coll%C3%A8ge',
        'isBaseRessourcesYearMoins2': true
    },
    'bourse_lycee': {
        'id': 'bourse_lycee',
        'isMontantAnnuel': true,
        'label': 'Bourse de lycée',
        'shortLabel': 'Bourse lycée',
        'description': 'La bourse des lycées est accordée, sous condition de ressources, à la famille d’un lycéen. Son montant dépend des ressources et des charges de la famille. Cette bourse peut être accompagnée de diverses primes (prime d’équipement, prime à la qualification, bourse au mérite au lycée, prime à l’internat...).',
        'imgSrc': 'logo_education_nationale.png',
        'link': 'http://www.education.gouv.fr/cid151/aides-financieres-au-lycee.html#Les%20bourses%20de%20lycée',
        'isBaseRessourcesYearMoins2': true
    },
    'paris_logement_familles': {
        'id': 'paris_logement_familles',
        'isMontantAnnuel': false,
        'label': 'Paris Logement Familles',
        'shortLabel': 'PLF',
        'description': 'L’allocation Paris Logement Familles permet aux familles parisiennes de mieux supporter leurs dépenses de logement.',
        'conditions': [
            'Avoir demandé le versements des aides logement auxquelles vous avez droit auprès de la CAF.',
            'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
        ],
        'imgSrc': 'logo_mairie_paris.png',
        'link': 'http://www.paris.fr/aides',
        'isBaseRessourcesYearMoins2': false,
        'roundToNearest10': false
    },
    'adpa': {
        'id': 'adpa',
        'isMontantAnnuel': false,
        'unit': '%',
        'legend': 'des frais de dépendance',
        'label': 'Allocation Départementale Personnalisée d’Autonomie',
        'shortLabel': 'ADPA',
        'description': 'Allocation versée aux personnes dépendantes âgées de plus de 60 ans. Elle a pour objectif de financer des services d’aide à la personne favorisant leur autonomie dans les gestes quotidiens.',
        'conditions': [],
        'imgSrc': 'logo_cd93.png',
        'link': 'https://www.seine-saint-denis.fr/ADPA.html',
        'isBaseRessourcesYearMoins2': false
    },
    'aah': {
        'id': 'aah',
        'isMontantAnnuel': false,
        'label': 'Allocation aux adultes handicapés',
        'shortLabel': 'AAH',
        'imgSrc': 'logo_caf.png',
        'description': 'L’AAH est une aide financière qui permet d’assurer un revenu minimum aux adultes handicapés.',
        'isBaseRessourcesYearMoins2': true,
        'uncomputability': {
            'intervention_CDAPH_necessaire': {
                'reason': 'le montant de l’AAH dépend du taux d’incapacité déterminé par la <abbr title="Commission des droits et de l’autonomie des personnes handicapées">CDAPH</abbr> après le dépôt de votre demande',
                'solution': 'Contactez <a href="http://informations.handicap.fr/carte-france-mdph.php">la <abbr title="Maison départementale des personnes handicapées">MDPH</abbr> la plus proche</a> pour faire établir ce taux. Attention, votre éligibilité à l’AAH peut impacter vos droits au RSA et à la CMU-C.'
            }
        },
        'link': 'https://www.service-public.fr/particuliers/vosdroits/F12242'
    },
    'ppa' : {
        'id': 'ppa',
        'label': 'Prime d’activité',
        'imgSrc': 'logo_caf.png',
        'description': 'La Prime d’activité remplace le RSA activité et la prime pour l’emploi depuis janvier 2016. Elle complète les ressources des personnes qui travaillent et ont des revenus modestes, salariées ou non.',
        'link': 'https://www.caf.fr/actualites/2015/une-nouvelle-prestation-a-l-horizon-2016-la-prime-d-activite'
    }
});
