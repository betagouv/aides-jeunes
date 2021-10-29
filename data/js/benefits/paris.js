const {
  PERIODICITE_MENSUELLE,
  PERIODICITE_ANNUELLE,
} = require("../../../lib/Benefits")

module.exports = {
  imgSrc: "logo_paris.png",
  label: "Ville de Paris",
  prefix: "de la",
  repository: "paris",
  prestations: {
    paris_logement_familles: {
      periodicite: PERIODICITE_MENSUELLE,
      label: "Paris Logement Famille",
      unit: "€",
      type: "float",
      description:
        "L’allocation Paris Logement Famille est destinée aux familles d’au moins deux enfants ou ayant un enfant handicapé. Elle leur permet de mieux supporter leurs dépenses de logement. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.",
      conditions: [
        "Avoir demandé le versements des aides logement auxquelles vous avez droit auprès de la CAF.",
        "Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.",
      ],
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-logement-familles",
      form: "https://cdn.paris.fr/paris/2019/07/24/736d309a8cdbf436475f7514f443a08b.pdf",
      isBaseRessourcesYearMoins2: false,
      entity: "familles",
    },
    paris_forfait_familles: {
      periodicite: PERIODICITE_ANNUELLE,
      label: "Paris Forfait Familles",
      unit: "€",
      type: "float",
      description:
        "Paris Forfait Familles est une aide destinée aux familles nombreuses avec au moins trois enfants à charge. Elle peut se cumuler avec l’Allocation de Soutien aux Parents d’Enfants Handicapés. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.",
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-forfait-familles",
      form: "https://cdn.paris.fr/paris/2019/07/24/8fa764ddcfa7659c447e2b383b8cb986.pdf",
      isBaseRessourcesYearMoins2: false,
      entity: "familles",
    },
    paris_logement_psol: {
      label: "Paris Solidarité",
      periodicite: PERIODICITE_MENSUELLE,
      unit: "€",
      type: "float",
      description:
        "Paris Solidarité est destinée aux personnes âgées de 65 ans ou plus et aux personnes en situation de handicap. L’aide peut être versée tous les mois à partir de 60 ans pour les personnes reconnus inaptes au travail. Elle a pour but de garantir aux foyers modestes un minimum de ressources. L’aide est accordée pour une durée maximale d’un an.",
      conditions: [
        "Percevoir tous les avantages légaux auxquels vous pouvez prétendre.",
        "Ne pas avoir déjà bénéficié du dispositif sur une durée de deux ans.",
      ],
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-solidarite",
      form: "https://cdn.paris.fr/paris/2019/07/24/44a441e89f01b513b678ecde6e088ce4.pdf",
      isBaseRessourcesYearMoins2: false,
      entity: "familles",
    },
    paris_logement: {
      label: "Paris Logement",
      periodicite: PERIODICITE_MENSUELLE,
      unit: "€",
      type: "float",
      description:
        "L’allocation Paris Logement est destinée aux foyers modestes pour leur permettre de mieux supporter leurs dépenses de logement. Ils doivent être locataires en titre et titulaires du bail du logement occupé à titre principal. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, Paris Logement peut être accordée pour une durée maximale de deux ans.",
      conditions: [
        "Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.",
        "Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.",
      ],
      link: "https://www.paris.fr/pages/aides-au-logement-3827/#paris-logement",
      form: "https://cdn.paris.fr/paris/2020/01/13/9951415db06e3d73e54625d5972c7229.pdf",
      isBaseRessourcesYearMoins2: false,
      entity: "familles",
    },
    paris_logement_aspeh: {
      label: "Allocation de Soutien aux Parents d’Enfants Handicapés",
      periodicite: PERIODICITE_MENSUELLE,
      unit: "€",
      type: "float",
      description:
        "L’Allocation de Soutien aux Parents d’Enfants Handicapés est réservée aux familles ayant à charge un ou plusieurs enfants handicapés. Elle est accordée pour un an et renouvelable. Si l’enfant handicapé vit au domicile, l’aide est versée tous les mois.",
      conditions: [
        "Indiquer le nombre de jours passés par l’enfant handicapé au domicile, lorsqu’il est placé dans un établissement spécialisé.",
      ],
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#allocation-de-soutien-aux-parents-d-enfants-handicapes",
      form: "https://cdn.paris.fr/paris/2019/07/24/3c8e229bd25b112eaf9227769873a230.pdf",
      isBaseRessourcesYearMoins2: false,
      prefix: "l’",
      entity: "familles",
    },
    paris_logement_plfm: {
      label: "Paris Logement Familles Monoparentales",
      periodicite: PERIODICITE_MENSUELLE,
      unit: "€",
      type: "float",
      description:
        "L’allocation Paris Logement Famille Monoparentale est destinée aux parents seuls, ayant un ou plusieurs enfants à charge. Elle leur permet de mieux supporter leurs dépenses de logement. Elle est ouverte aux locataires, aux propriétaires et aux personnes accédant à la propriété. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.",
      conditions: [
        "Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.",
        "Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.",
      ],
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-logement-famille-monoparentale",
      form: "https://cdn.paris.fr/paris/2019/07/24/75686b9338b397db4b05069015762d8b.pdf",
      isBaseRessourcesYearMoins2: false,
      entity: "familles",
    },
    paris_energie_familles: {
      periodicite: PERIODICITE_ANNUELLE,
      label: "Paris Énergie Familles",
      unit: "€",
      type: "float",
      description:
        "L’allocation Paris Énergie Familles est réservée aux familles ayant un ou plusieurs enfants à charge, sous condition d’imposition. Cette aide permet de les soutenir dans leurs dépenses d’électricité et/ou de gaz. Paris Énergie Famille est directement versée aux fournisseurs d’énergie. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.",
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#paris-energie-familles",
      form: "https://cdn.paris.fr/paris/2019/07/24/ef5b3f1bcd3a62ec75576748e88a0dd7.pdf",
      isBaseRessourcesYearMoins2: false,
      entity: "familles",
    },
    paris_complement_sante: {
      periodicite: PERIODICITE_ANNUELLE,
      label: "Complément Santé Paris",
      unit: "€",
      type: "float",
      description:
        "Le Complément Santé Paris est destiné aux personnes âgées de 65 ans ou plus et aux personnes en situation de handicap. L’aide peut être versée à partir de 60 ans pour les personnes reconnues inaptes au travail. Elle a pour but d’aider les foyers modestes à régler leurs frais de mutuelle. L’aide est accordée pour une durée maximale d’un an.",
      conditions: [
        "Percevoir les avantages légaux auxquels vous pouvez prétendre (Couverture Maladie Universelle Complémentaire, Aide à la Complémentaire Santé).",
        "Adhérer à titre payant à un organisme de protection complémentaire.",
      ],
      link: "https://www.paris.fr/pages/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626/#complement-sante-paris",
      form: "https://cdn.paris.fr/paris/2019/07/24/c3175c019a067ac0b1bf2714742f0bbc.pdf",
      isBaseRessourcesYearMoins2: false,
      prefix: "le",
      entity: "familles",
    },
    paris_pass_seniors: {
      label: "Pass Paris Seniors",
      type: "bool",
      description:
        "Le Pass Paris Seniors est destiné aux personnes âgées de 65 ans ou plus (et à partir de 60 ans pour les personnes reconnues inaptes au travail). Il permet de voyager gratuitement sur l’ensemble du réseau des transports en commun d’Île-de-France (zones 1 à 5).",
      link: "https://www.paris.fr/pages/aides-aux-transports-3848/#pass-paris-seniors",
      form: "https://cdn.paris.fr/paris/2020/01/10/03d74c0a9d051a5736302fc861d66ef5.pdf",
      entity: "individus", // default entity is famille
      prefix: "le",
    },
    paris_pass_access: {
      label: "Pass Paris Access’",
      type: "bool",
      description:
        "Le Pass Paris Access’ est destiné aux personnes en situation de handicap. Il permet de voyager gratuitement sur l’ensemble du réseau des transports en commun d’Île-de-France (zones 1 à 5).",
      link: "https://www.paris.fr/pages/aides-aux-transports-3848/#pass-paris-access",
      form: "https://cdn.paris.fr/paris/2019/11/18/ec559b1825e317b94c547d813dd1fd7d.pdf",
      entity: "individus", // default entity is famille
      prefix: "le",
    },
  },
}
