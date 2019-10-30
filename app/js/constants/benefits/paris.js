

module.exports = {
    'imgSrc': 'logo_paris.png',
    'label': 'Ville de Paris',
    'prefix': 'de la',
    'prestations': {
        'paris_logement_familles': {
            'isMontantAnnuel': false,
            'label': 'Paris Logement Famille',
            'description': 'L’allocation Paris Logement Famille est destinée aux familles d’au moins deux enfants ou ayant un enfant handicapé. Elle leur permet de mieux supporter leurs dépenses de logement. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.',
            'conditions': [
                'Avoir demandé le versements des aides logement auxquelles vous avez droit auprès de la CAF.',
                'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
            ],
            'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille_7',
            'form': 'https://api-site.paris.fr/images/73485',
            'isBaseRessourcesYearMoins2': false,
        },
        'paris_forfait_familles': {
            'isMontantAnnuel': true,
            'label': 'Paris Forfait Familles',
            'description': 'Paris Forfait Familles est une aide destinée aux familles nombreuses avec au moins trois enfants à charge. Elle peut se cumuler avec l’Allocation de Soutien aux Parents d’Enfants Handicapés. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.',
            'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-forfait-famille_2',
            'form': 'https://api-site-cdn.paris.fr/images/97066',
            'isBaseRessourcesYearMoins2': false,
        },
        'paris_logement_psol': {
            'label': 'Paris Solidarité',
            'description': 'Paris Solidarité est destinée aux personnes âgées de 65 ans ou plus et aux personnes en situation de handicap. L’aide peut être versée tous les mois à partir de 60 ans pour les personnes reconnus inaptes au travail. Elle a pour but de garantir aux foyers modestes un minimum de ressources. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, Paris Solidarité peut être accordée pour une durée maximale de deux ans.',
            'conditions': [
                'Percevoir tous les avantages légaux auxquels vous pouvez prétendre.',
            ],
            'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-solidarite_3',
            'form': 'https://api-site-cdn.paris.fr/images/97049',
            'isBaseRessourcesYearMoins2': false,
        },
        'paris_logement': {
            'label': 'Paris Logement',
            'description': 'L’allocation Paris Logement est destinée aux personnes seules ou en couple sans ou avec un enfant. Elle leur permet de mieux supporter leurs dépenses de logement. Ils doivent être locataires en titre et titulaires du bail du logement occupé à titre principal. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, Paris Logement peut être accordée pour une durée maximale de deux ans.',
            'conditions': [
                'Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.',
                'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
            ],
            'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement_6',
            'form': 'https://api-site-cdn.paris.fr/images/97085',
            'isBaseRessourcesYearMoins2': false,
        },
        'paris_logement_aspeh': {
            'label': 'Allocation de Soutien aux Parents d’Enfants Handicapés',
            'description': 'L’Allocation de Soutien aux Parents d’Enfants Handicapés est réservée aux familles ayant à charge un ou plusieurs enfants handicapés. Si l’enfant handicapé vit au domicile, l’aide est versée tous les mois et accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier. Si l’enfant est placé dans un établissement spécialisé, le montant dépend du nombre de jours passés par le ou les enfants au domicile.',
            'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#allocation-de-soutien-aux-parents-d-enfants-handicapes_9',
            'form': 'https://api-site-cdn.paris.fr/images/97060',
            'isBaseRessourcesYearMoins2': false,
            prefix: 'l’',
        },
        'paris_logement_plfm': {
            'label': 'Paris Logement Familles Monoparentales',
            'description': 'L’allocation Paris Logement Famille Monoparentale est destinée aux parents seuls, ayant un ou plusieurs enfants à charge. Elle leur permet de mieux supporter leurs dépenses de logement. Elle est ouverte aux locataires, aux propriétaires et aux personnes accédant à la propriété. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.',
            'conditions': [
                'Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.',
                'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
            ],
            'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille-monoparentale_5',
            'form': 'https://api-site-cdn.paris.fr/images/90099',
            'isBaseRessourcesYearMoins2': false,
        },
        'paris_energie_familles': {
            'isMontantAnnuel': true,
            'label': 'Paris Énergie Familles',
            'description': 'L’allocation Paris Énergie Familles est réservée aux familles ayant un ou plusieurs enfants à charge, sous condition d’imposition. Cette aide permet de les soutenir dans leurs dépenses d’électricité et/ou de gaz. Paris Énergie Famille est directement versée aux fournisseurs d’énergie. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.',
            'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-energie-famille_8',
            'form': 'https://api-site-cdn.paris.fr/images/97093',
            'isBaseRessourcesYearMoins2': false,
        },
        'paris_complement_sante': {
            'isMontantAnnuel': true,
            'label': 'Complément Santé Paris',
            'description': 'Le Complément Santé Paris est destiné aux personnes âgées de 65 ans ou plus et aux personnes en situation de handicap. L’aide peut être versée à partir de 60 ans pour les personnes reconnues inaptes au travail. Elle a pour but d’aider les foyers modestes à régler leurs frais de mutuelle. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, le Complément Santé Paris peut être accordé pour une durée maximale de deux ans.',
            'conditions': [
                'Percevoir les avantages légaux auxquels vous pouvez prétendre (Couverture Maladie Universelle Complémentaire, Aide à la Complémentaire Santé).',
                'Adhérer à titre payant à un organisme de protection complémentaire.'
            ],
            'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#complement-sante-paris_10',
            'form': 'https://api-site.paris.fr/images/78343',
            'isBaseRessourcesYearMoins2': false,
            prefix: 'le',
        },
        'paris_pass_seniors': {
            'label': 'Pass Paris Seniors',
            'description': 'Le Pass Paris Seniors est destiné aux personnes âgées de 65 ans ou plus (et à partir de 60 ans pour les personnes reconnues inaptes au travail). Il permet de voyager gratuitement sur l’ensemble du réseau des transports en commun d’Île-de-France (zones 1 à 5).',
            'link': 'https://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/aides-aux-transports-3848#pass-paris-seniors_11',
            'form': 'https://api-site-cdn.paris.fr/images/100460',
            'type': 'bool', // default type is float
            'entity': 'individu', // default entity is famille
            prefix: 'le',
        },
        'paris_pass_access': {
            'label': 'Pass Paris Access’',
            'description': 'Le Pass Paris Access’ est destiné aux personnes en situation de handicap. Il permet de voyager gratuitement sur l’ensemble du réseau des transports en commun d’Île-de-France (zones 1 à 5).',
            'link': 'https://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/aides-aux-transports-3848#pass-paris-access_5',
            'form': 'https://api-site-cdn.paris.fr/images/100461',
            'type': 'bool', // default type is float
            'entity': 'individu', // default entity is famille
            prefix: 'le',
        }
    }
};
