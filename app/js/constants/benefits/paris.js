module.exports = {
  imgSrc: "logo_paris.png",
  label: "Ville de Paris",
  prefix: "de la",
  repository: "paris",
  prestations: {
    paris_logement_familles: {
      isMontantAnnuel: false,
      label: "Paris Logement Famille",
      description:
        "L’allocation Paris Logement Famille est destinée aux familles d’au moins deux enfants ou ayant un enfant handicapé. Elle leur permet de mieux supporter leurs dépenses de logement. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.",
      conditions: [
        "Avoir demandé le versements des aides logement auxquelles vous avez droit auprès de la CAF.",
        "Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.",
      ],
      link: "http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille_7",
      form: "https://api-site.paris.fr/images/73485",
      isBaseRessourcesYearMoins2: false,
    },
    paris_forfait_familles: {
      isMontantAnnuel: true,
      label: "Paris Forfait Familles",
      description:
        "Paris Forfait Familles est une aide destinée aux familles nombreuses avec au moins trois enfants à charge. Elle peut se cumuler avec l’Allocation de Soutien aux Parents d’Enfants Handicapés. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.",
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-forfait-familles",
      form: "https://cdn.paris.fr/paris/2019/07/24/8fa764ddcfa7659c447e2b383b8cb986.pdf",
      isBaseRessourcesYearMoins2: false,
    },
    paris_logement_psol: {
      label: "Paris Solidarité",
      description:
        "Paris Solidarité est destinée aux personnes âgées de 65 ans ou plus et aux personnes en situation de handicap. L’aide peut être versée tous les mois à partir de 60 ans pour les personnes reconnus inaptes au travail. Elle a pour but de garantir aux foyers modestes un minimum de ressources. L’aide est accordée pour une durée maximale d’un an.",
      conditions: [
        "Percevoir tous les avantages légaux auxquels vous pouvez prétendre.",
        "Ne pas avoir déjà bénéficié du dispositif sur une durée de deux ans.",
      ],
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-solidarite",
      form: "https://cdn.paris.fr/paris/2019/07/24/44a441e89f01b513b678ecde6e088ce4.pdf",
      isBaseRessourcesYearMoins2: false,
    },
    paris_logement: {
      label: "Paris Logement",
      description:
        "L’allocation Paris Logement est destinée aux foyers modestes pour leur permettre de mieux supporter leurs dépenses de logement. Ils doivent être locataires en titre et titulaires du bail du logement occupé à titre principal. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, Paris Logement peut être accordée pour une durée maximale de deux ans.",
      conditions: [
        "Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.",
        "Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.",
      ],
      link: "https://www.paris.fr/pages/aides-au-logement-3827/#paris-logement",
      form: "https://cdn.paris.fr/paris/2020/01/13/9951415db06e3d73e54625d5972c7229.pdf",
      isBaseRessourcesYearMoins2: false,
    },
    paris_logement_aspeh: {
      label: "Allocation de Soutien aux Parents d’Enfants Handicapés",
      description:
        "L’Allocation de Soutien aux Parents d’Enfants Handicapés est réservée aux familles ayant à charge un ou plusieurs enfants handicapés. Elle est accordée pour un an et renouvelable. Si l’enfant handicapé vit au domicile, l’aide est versée tous les mois.",
      conditions: [
        "Indiquer le nombre de jours passés par l’enfant handicapé au domicile, lorsqu’il est placé dans un établissement spécialisé.",
      ],
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#allocation-de-soutien-aux-parents-d-enfants-handicapes",
      form: "https://cdn.paris.fr/paris/2019/07/24/3c8e229bd25b112eaf9227769873a230.pdf",
      isBaseRessourcesYearMoins2: false,
      prefix: "l’",
    },
    paris_logement_plfm: {
      label: "Paris Logement Familles Monoparentales",
      description:
        "L’allocation Paris Logement Famille Monoparentale est destinée aux parents seuls, ayant un ou plusieurs enfants à charge. Elle leur permet de mieux supporter leurs dépenses de logement. Elle est ouverte aux locataires, aux propriétaires et aux personnes accédant à la propriété. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.",
      conditions: [
        "Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.",
        "Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.",
      ],
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-logement-famille-monoparentale",
      form: "https://cdn.paris.fr/paris/2019/07/24/75686b9338b397db4b05069015762d8b.pdf",
      isBaseRessourcesYearMoins2: false,
    },
    paris_energie_familles: {
      isMontantAnnuel: true,
      label: "Paris Énergie Familles",
      description:
        "L’allocation Paris Énergie Familles est réservée aux familles ayant un ou plusieurs enfants à charge, sous condition d’imposition. Cette aide permet de les soutenir dans leurs dépenses d’électricité et/ou de gaz. Paris Énergie Famille est directement versée aux fournisseurs d’énergie. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.",
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-energie-familles",
      form: "https://api-site-cdn.paris.fr/images/97093",
      isBaseRessourcesYearMoins2: false,
    },
    paris_complement_sante: {
      isMontantAnnuel: true,
      label: "Complément Santé Paris",
      description:
        "Le Complément Santé Paris est destiné aux personnes âgées de 65 ans ou plus et aux personnes en situation de handicap. L’aide peut être versée à partir de 60 ans pour les personnes reconnues inaptes au travail. Elle a pour but d’aider les foyers modestes à régler leurs frais de mutuelle. L’aide est accordée pour une durée maximale d’un an.",
      conditions: [
        "Percevoir les avantages légaux auxquels vous pouvez prétendre (Couverture Maladie Universelle Complémentaire, Aide à la Complémentaire Santé).",
        "Adhérer à titre payant à un organisme de protection complémentaire.",
      ],
      link: "http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#complement-sante-paris_10",
      form: "https://api-site.paris.fr/images/78343",
      isBaseRessourcesYearMoins2: false,
      prefix: "le",
    },
    paris_pass_seniors: {
      label: "Pass Paris Seniors",
      description:
        "Le Pass Paris Seniors est destiné aux personnes âgées de 65 ans ou plus (et à partir de 60 ans pour les personnes reconnues inaptes au travail). Il permet de voyager gratuitement sur l’ensemble du réseau des transports en commun d’Île-de-France (zones 1 à 5).",
      link: "https://www.paris.fr/pages/aides-aux-transports-3848/#pass-paris-seniors",
      form: "https://cdn.paris.fr/paris/2020/01/10/03d74c0a9d051a5736302fc861d66ef5.pdf",
      type: "bool", // default type is float
      entity: "individus", // default entity is famille
      prefix: "le",
    },
    paris_pass_access: {
      label: "Pass Paris Access’",
      description:
        "Le Pass Paris Access’ est destiné aux personnes en situation de handicap. Il permet de voyager gratuitement sur l’ensemble du réseau des transports en commun d’Île-de-France (zones 1 à 5).",
      link: "https://www.paris.fr/pages/aides-aux-transports-3848/#pass-paris-access",
      form: "https://cdn.paris.fr/paris/2019/11/18/ec559b1825e317b94c547d813dd1fd7d.pdf",
      type: "bool", // default type is float
      entity: "individus", // default entity is famille
      prefix: "le",
    },
  },
}
