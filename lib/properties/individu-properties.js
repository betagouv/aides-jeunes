const Individu = require("../individu")
const { capitalize, isRelevant, yearsAgo } = require("../utils")
const Scolarite = require("../scolarite")
const { getAnswer } = require("../answers")

module.exports = {
  aah_restriction_substantielle_durable_acces_emploi: {
    question: ({ individu }) => {
      return `${Individu.label(
        individu,
        "avoir"
      )} une restriction substantielle et
      durable d'accès à l'emploi reconnue par la
      <abbr
        title="Commission des droits et de l'autonomie des personnes handicapées"
        >CDAPH</abbr
      > ?`
    },
    help: "Attention, cette restriction est différente de la reconnaissance de la qualité de travailleur handicapé.",
  },

  activite: {
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} ?`
    },
    questionType: "enum",
    items: (data) => {
      let items = [
        {
          value: "etudiant",
          label: "Étudiant·e en formation ou alternance",
        },
        {
          value: "salarie",
          label: "Salarié·e",
        },
        {
          value: "independant",
          label: "Indépendant·e",
        },
        {
          value: "service_civique",
          label: "En service civique",
        },
        {
          value: "chomeur",
          label: "Inscrit·e comme demandeur d’emploi",
        },
        {
          value: "retraite",
          label: "Retraité·e",
          isRelevant: ({ individu, periods }) =>
            Individu.age(individu, periods.today.value) > 30,
        },
        {
          value: "inactif",
          label: "Autre",
        },
      ]
      return isRelevant(items, data)
    },
    moreInfo:
      "Lorsque vous êtes étudiant·e salarié·e, vous devez sélectionner « Étudiant·e en formation ou alternance ».",
  },

  alternant: {
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en alternance ?`
    },
  },

  annee_etude: {
    question: "Dans quelle classe êtes-vous actuellement ?",
    questionType: "enum",
    items: ({ individu }) => {
      return [
        {
          label: "CAP - 1ère année",
          value: "cap_1",
          only: "lycee",
        },
        {
          label: "CAP - 2ème année",
          value: "cap_2",
          only: "lycee",
        },
        {
          label: "Seconde",
          value: "seconde",
          only: "lycee",
        },
        {
          label: "Première",
          value: "premiere",
          only: "lycee",
        },
        {
          label: "Terminale",
          value: "terminale",
          only: "lycee",
        },
        {
          label: "BTS",
          value: "bts_1",
          only: "enseignement_superieur",
        },
        {
          label: "BUT",
          value: "but_1",
          only: "enseignement_superieur",
        },
        {
          label: "CPGE",
          value: "cpge_1",
          only: "enseignement_superieur",
        },
        {
          label: "Licence - 1ère année",
          value: "licence_1",
          only: "enseignement_superieur",
        },
        {
          label: "Licence - 2ème année",
          value: "licence_2",
          only: "enseignement_superieur",
        },
        {
          label: "Licence - 3ème année",
          value: "licence_3",
          only: "enseignement_superieur",
        },
        {
          label: "Master - 1ère année",
          value: "master_1",
          only: "enseignement_superieur",
        },
        {
          label: "Master - 2ème année",
          value: "master_2",
          only: "enseignement_superieur",
        },
        {
          label: "Doctorat - 1ère année",
          value: "doctorat_1",
          only: "enseignement_superieur",
        },
        {
          label: "Doctorat - 2ème année",
          value: "doctorat_2",
          only: "enseignement_superieur",
        },
        {
          label: "Doctorat - 3ème année",
          value: "doctorat_3",
          only: "enseignement_superieur",
        },
        {
          label: "Autre",
          value: "autre",
        },
      ].filter((item) => !item.only || item.only === individu.scolarite)
    },
  },

  ass_precondition_remplie: {
    question: ({ individu }) => {
      const date_debut_chomage = individu.date_debut_chomage
      return `${Individu.label(individu, "avoir")} travaillé
      <abbr
        title="1825 jours (5 fois 365) couverts par un contrat de travail, en activité ou en congés."
        >au moins 5 ans</abbr
      >
      entre ${yearsAgo(10, date_debut_chomage)}
      et ${yearsAgo(0, date_debut_chomage)} ?`
    },
  },

  bourse_criteres_sociaux_base_ressources_parentale: {
    question: ({ periods }) => {
      return `Quel est le revenu brut global ${yearsAgo(
        2,
        periods.today.id,
        "YYYY"
      )} figurant sur l’avis fiscal ${yearsAgo(
        1,
        periods.today.id,
        "YYYY"
      )} de vos parents ?`
    },
    questionType: "number",
    moreInfo:
      "Lorsque les parents sont séparés, il faut prendre les ressources du parent ayant à la charge l'étudiant. Si l'étudiant est en garde alternée, il faut faire la somme des ressources des deux foyers fiscaux des parents séparés.",
    showMoreInfo: ({ simulation }) => {
      const _situation = getAnswer(
        simulation.answers.current,
        "parents",
        "_situation"
      )
      // TODO tester
      return ["separes", "celibataire"].includes(_situation)
    },
    unit: "€",
  },

  boursier: {
    question: "Bénéficiez-vous d'une bourse de l'enseignement supérieur ?",
  },

  categorie_salarie: {
    question: "Êtes-vous en alternance dans le secteur public ?",
    questionType: "enum",
    items: [
      {
        label: "Oui",
        value: "public_non_titulaire",
      },
      {
        label: "Non",
        value: "prive_non_cadre",
      },
    ],
  },

  date_debut_chomage: {
    question: ({ individu }) => {
      return `Quand ${Individu.label(
        individu,
        "avoir"
      )} commencé à être au chômage ?`
    },
    questionType: "date",
  },

  date_naissance: {
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? `Quelle est votre date de naissance ?`
        : `Quelle est la date de naissance ${Individu.label(
            individu,
            "préposition"
          )}${Individu.label(individu, "nom")} ?`
    },
    questionType: "date",
  },

  enceinte: {
    question: ({ individu }) => {
      return `${
        individu._role === "demandeur"
          ? "Êtes-vous"
          : "Votre conjointe est-elle"
      } enceinte ?`
    },
    questionType: "enum",
    items: [
      {
        label: "Oui",
        value: "enceinte",
      },
      {
        label: "Non",
        value: "pas_enceinte",
      },
      {
        label: "Pas concerné",
        value: "pas_concerne",
      },
    ],
  },

  enfant_a_charge: {
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? "Avez-vous fait votre propre déclaration d'impôts ?"
        : `${capitalize(
            Individu.label(individu, "nom")
          )} figure-t-il/elle sur votre dernière déclaration d'impôts sur le revenu ?`
    },
    questionType: "enum",
    items: ({ individu }) => {
      const isDemandeur = individu._role === "demandeur"
      return [
        {
          value: !isDemandeur,
          label: "Oui",
        },
        {
          value: isDemandeur,
          label: "Non",
        },
      ]
    },
  },

  enfant_place: {
    question: ({ individu }) => {
      return `${Individu.label(
        individu,
        "être"
      )} placé·e en structure spécialisée ou famille d'accueil ?`
    },
  },

  _formationSanitaireSocial: {
    question:
      "Êtes-vous inscrit·e dans une formation du secteur sanitaire et social ?",
    moreInfo:
      "Exemples : auxiliaire de vie sociale, éducateur·ice spécialisé·e, infirmier·e, ambulancier·e...",
  },

  garde_alternee: {
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en garde alternée ?`
    },
  },

  gir: {
    question: ({ individu }) => {
      return `${Individu.label(individu, "avoir")} besoin d’une aide à la
      personne ?`
    },
    questionType: "enum",
    items: [
      {
        value: "gir_6",
        label: "Jamais",
      },
      {
        value: "gir_5",
        label: "Ponctuellement",
      },
      {
        value: "gir_1",
        label: "Régulièrement",
      },
    ],
  },

  habite_chez_parents: {
    question: "Êtes-vous hébergé chez vos parents ?",
  },

  handicap: {
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en situation de handicap ?`
    },
    moreInfo: (variation) => {
      if (variation?.includes("enfant")) {
        return `Votre enfant est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci l'a reconnu comme tel·le et qu'elle lui a également attribué un « taux d'incapacité » lié à son handicap.`
      } else if (variation?.includes("conjoint")) {
        return `Votre conjoint est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci l'a reconnu comme tel·le et qu'elle lui a également attribué un « taux d'incapacité » lié à son handicap.`
      } else {
        return `Vous êtes « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci vous a reconnu comme tel·le et qu'elle vous a également attribué un « taux d'incapacité » lié à votre handicap.`
      }
    },
  },

  inapte_travail: {
    question: ({ individu }) => {
      return `${Individu.label(
        { individu },
        "être"
      )} reconnu·e inapte au travail ?`
    },
    moreInfo:
      "Vous pouvez être « inapte au travail » après un accident ou une maladie. C'est le médecin du travail qui détermine cela.",
  },

  mention_baccalaureat: {
    question: "Avez-vous obtenu une mention au baccalauréat ?",
    questionType: "enum",
    items: Scolarite.mentionsBaccalaureat,
  },

  nationalite: {
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? "Quelle est votre nationalité ?"
        : `Quelle est la nationalité ${Individu.label(
            individu,
            "préposition"
          )}${Individu.label(individu, "nom")} ?`
    },
    questionType: "enum",
    items: [
      {
        label: "Française",
        value: "FR",
      },
      {
        label: "Européenne",
        value: "DE",
      },
      {
        label: "Non européenne",
        value: "AF",
      },
    ],
  },

  regime_securite_sociale: {
    question: ({ individu, periods }) => {
      return individu.enfant_a_charge[periods.thisYear.id]
        ? "Quel est le régime de protection sociale de vos parents ?"
        : "Quel est votre régime de protection sociale ?"
    },
    questionType: "enum",
    items: [
      {
        value: "regime_general",
        label: "Régime général (CAF/CPAM)",
      },
      {
        value: "regime_agricole",
        label: "Mutualité sociale agricole (MSA)",
      },
      {
        value: "autres_regimes",
        label: "Autre",
      },
      {
        value: "inconnu",
        label: "Je ne sais pas",
      },
    ],
  },

  rsa_jeune_condition_heures_travail_remplie: {
    question: ({ individu, periods }) => {
      return `${Individu.label(individu, "avoir")} travaillé
      <abbr
        title="ou 3 214 heures (2 fois 1 607) couvertes par un contrat de travail."
        >au moins 2 ans</abbr
      >
      depuis ${yearsAgo(3, periods.today.id)} ?`
    },
  },

  scolarite: {
    question: ({ individu }) => {
      return individu._role == "demandeur"
        ? "Où êtes-vous scolarisé·e ?"
        : `Où sera scolarisé·e ${individu._firstName} à la rentrée prochaine ?`
    },
    questionType: "enum",
    items: Scolarite.types,
    moreInfo:
      "Pour les étudiants en classes préparatoires aux grandes écoles, il faut sélectionner « Dans un établissement de l'enseignement supérieur ».",
  },

  sortie_academie: {
    question: ({ individu }) => {
      return `${Individu.label(individu, "avoir")} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.education.gouv.fr/les-regions-academiques-academies-et-services-departementaux-de-l-education-nationale-6557"
        >hors de votre académie</a
      >
      l'an prochain ?`
    },
  },

  sortie_region_academique: {
    question: ({ individu }) => {
      return `${Individu.label(individu, "avoir")} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.etudiant.gouv.fr/fr/aide-la-mobilite-en-master-1504#item2"
        >hors de votre région académique</a
      >
      l'an prochain ?`
    },
  },

  stagiaire: {
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en stage ?`
    },
  },

  statuts_etablissement_scolaire: {
    question: "Dans quel type d'établissement étudiez-vous actuellement ?",
    questionType: "enum",
    items: [
      {
        value: "public",
        label: "Établissement public",
      },
      {
        value: "prive_sous_contrat",
        label: "Établissement privé sous contrat",
      },
      {
        value: "prive_hors_contrat",
        label: "Établissement privé hors contrat",
      },
      {
        value: "inconnu",
        label: "Autre",
      },
    ],
  },

  statut_marital: {
    question: "Quelle est votre relation avec votre conjoint·e ?",
    questionType: "enum",
    items: Individu.situationsFamiliales,
  },

  taux_incapacite: {
    question: ({ individu }) => {
      const start =
        individu._role === "demandeur"
          ? `Quel est votre taux d'incapacité`
          : `Quel est le taux d'incapacité ${Individu.label(
              individu,
              "préposition"
            )}${Individu.label(individu, "nom")}`

      return `${start}
          évalué par ${Individu.label(individu, "possessive")}
          <abbr title="Maison départementale des personnes handicapées"
            >MDPH</abbr
          > ?`
    },
    questionType: "enum",
    items: ({ openFiscaParameters }) => {
      const tauxMax =
        openFiscaParameters[
          "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite"
        ]
      return [
        {
          value: 0.3,
          label: "Moins de 50%",
        },
        {
          value: (0.5 + tauxMax) / 2,
          label: `Entre 50% et ${tauxMax * 100}%`,
        },
        {
          value: (tauxMax + 1) / 2,
          label: `Plus de ${tauxMax * 100}%`,
        },
      ]
    },
  },

  _contrat_alternant: {
    question: "Êtes-vous ?",
    questionType: "enum",
    items: [
      {
        value: "apprenti",
        label: "En apprentissage",
      },
      {
        value: "professionnalisation",
        label: "En contrat de professionnalisation",
      },
    ],
  },

  _dureeMoisEtudesEtranger: {
    question:
      "Combien de mois envisagez-vous de partir à l'étranger dans le cadre de vos études ?",
    questionType: "number",
    unit: "mois",
    type: "count",
  },

  _interetAidesSanitaireSocial: {
    question:
      "Êtes-vous intéressé·e par les aides concernant les formations du secteur sanitaire et social ?",
  },

  _interetsAidesVelo: {
    question: "Souhaitez-vous connaître les aides pour acheter un vélo ?",
    questionType: "multiple",
    items: [
      { value: "velo_mecanique", label: "Vélo mécanique simple" },
      { value: "velo_electrique", label: "Vélo électrique" },
      { value: "velo_cargo", label: "Vélo cargo" },
      { value: "velo_cargo_electrique", label: "Vélo cargo électrique" },
      { value: "velo_pliant", label: "Vélo pliant" },
      { value: "velo_motorisation", label: "Motorisation d'un vélo classique" },
    ],
  },

  _interetBafa: {
    question: `Prévoyez-vous de passer le <abbr title="Brevet d'aptitude aux fonctions d'animateur">BAFA</abbr> ou le <abbr title="Brevet d'aptitude aux fonctions de directeur">BAFD</abbr> ?`,
  },

  _interetEtudesEtranger: {
    question:
      "Prévoyez-vous de partir à l'étranger dans le cadre de vos études ?",
  },

  _interetPermisDeConduire: {
    question: "Prévoyez-vous de passer le permis de conduire ?",
  },

  _nombreMoisDebutContratDeTravail: {
    question: ({ individu }) => {
      return individu.activite === "etudiant" && individu.alternant
        ? "Depuis quand avez-vous signé votre contrat d'alternance ?"
        : "Depuis quand avez-vous signé votre contrat de travail ?"
    },
    questionType: "enum",
    items: ({ individu, periods }) => {
      const jeune_actif = Individu.age(individu, periods.today.value) <= 25
      return [
        {
          value: 2,
          label: "Moins de 3 mois",
          isRelevant: true,
        },
        {
          value: 5,
          label: "Entre 3 et 6 mois",
          isRelevant: jeune_actif,
        },
        {
          value: 12,
          label: "Plus de 3 mois",
          isRelevant: !jeune_actif,
        },
        {
          value: 12,
          label: "Plus 6 mois",
          isRelevant: jeune_actif,
        },
      ].filter((item) => item.isRelevant)
    },
  },
}
