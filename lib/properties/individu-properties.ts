import {
  TextProperty,
  DateProperty,
  EnumProperty,
  MultipleProperty,
  NumberProperty,
  BooleanProperty,
} from "./property.js"

import Individu from "../individu.js"
import { capitalize, yearsAgo } from "../utils.js"
import Scolarite from "../scolarite.js"
import { getAnswer } from "../answers.js"

export default {
  aah_restriction_substantielle_durable_acces_emploi: new BooleanProperty({
    help: "Attention, cette restriction est différente de la reconnaissance de la qualité de travailleur handicapé.",
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
  }),

  activite: new EnumProperty({
    items: [
      {
        label: "Scolarisé·e, étudiant·e, alternant·e",
        value: "etudiant",
      },
      {
        label: "Salarié·e",
        value: "salarie",
      },
      {
        label: "Indépendant·e",
        value: "independant",
      },
      {
        label: "En service civique",
        value: "service_civique",
      },
      {
        label: "Inscrit·e comme demandeur d’emploi",
        value: "chomeur",
      },
      {
        isRelevant: ({ individu, periods }) =>
          Individu.age(individu, periods.today.value) > 30,
        label: "Retraité·e",
        value: "retraite",
      },
      {
        label: "Autre",
        value: "inactif",
      },
    ],
    moreInfo:
      "Lorsque vous êtes étudiant·e salarié·e, vous devez sélectionner « Étudiant·e en formation ou alternance ».",
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} ?`
    },
    questionType: "enum",
  }),

  alternant: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en alternance ?`
    },
  }),

  annee_etude: new EnumProperty({
    items: [
      {
        isRelevant({ individu }) {
          return individu.scolarite === "lycee"
        },
        label: "CAP - 1ère année",
        value: "cap_1",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "lycee"
        },
        label: "CAP - 2ème année",
        value: "cap_2",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "lycee"
        },
        label: "Seconde",
        value: "seconde",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "lycee"
        },
        label: "Première",
        value: "premiere",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "lycee"
        },
        label: "Terminale",
        value: "terminale",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "BTS",
        value: "bts_1",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "BUT",
        value: "but_1",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "CPGE",
        value: "cpge_1",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "Licence - 1ère année",
        value: "licence_1",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "Licence - 2ème année",
        value: "licence_2",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "Licence - 3ème année",
        value: "licence_3",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "Master - 1ère année",
        value: "master_1",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "Master - 2ème année",
        value: "master_2",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "Doctorat - 1ère année",
        value: "doctorat_1",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "Doctorat - 2ème année",
        value: "doctorat_2",
      },
      {
        isRelevant({ individu }) {
          return individu.scolarite === "enseignement_superieur"
        },
        label: "Doctorat - 3ème année",
        value: "doctorat_3",
      },
      {
        label: "Autre",
        value: "autre",
      },
    ],
    question: "Dans quelle classe êtes-vous actuellement ?",
    questionType: "enum",
  }),

  ass_precondition_remplie: new BooleanProperty({
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
  }),

  bourse_criteres_sociaux_base_ressources_parentale: new NumberProperty({
    moreInfo:
      "Lorsque les parents sont séparés, il faut prendre les ressources du parent ayant à la charge l'étudiant. Si l'étudiant est en garde alternée, il faut faire la somme des ressources des deux foyers fiscaux des parents séparés.",
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
    showMoreInfo: ({ simulation }) => {
      const _situation = getAnswer(
        simulation.answers.current,
        "parents",
        "_situation"
      )
      return ["separes", "celibataire"].includes(_situation)
    },
    unit: "€",
  }),

  boursier: new BooleanProperty({
    question: "Bénéficiez-vous d'une bourse de l'enseignement supérieur ?",
  }),

  categorie_salarie: new EnumProperty({
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
    question: "Êtes-vous en alternance dans le secteur public ?",
    questionType: "enum",
  }),

  date_debut_chomage: new DateProperty({
    question: ({ individu }) => {
      return `Quand ${Individu.label(
        individu,
        "avoir"
      )} commencé à être au chômage ?`
    },
  }),

  date_naissance: new DateProperty({
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? `Quelle est votre date de naissance ?`
        : `Quelle est la date de naissance ${Individu.label(
            individu,
            "préposition"
          )}${Individu.label(individu, "nom")} ?`
    },
  }),

  _contrat_alternant: new EnumProperty({
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
  }),

  enceinte: new EnumProperty({
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
    question: ({ individu }) => {
      return `${
        individu._role === "demandeur"
          ? "Êtes-vous"
          : "Votre conjointe est-elle"
      } enceinte ?`
    },
    questionType: "enum",
  }),

  _dureeMoisEtudesEtranger: new NumberProperty({
    question:
      "Combien de mois envisagez-vous de partir à l'étranger dans le cadre de vos études ?",
    type: "count",
    unit: "mois",
  }),

  enfant_a_charge: new EnumProperty({
    items: ({ individu }) => {
      const isDemandeur = individu._role === "demandeur"
      return [
        {
          label: "Oui",
          value: !isDemandeur,
        },
        {
          label: "Non",
          value: isDemandeur,
        },
      ]
    },
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? "Avez-vous fait votre propre déclaration d'impôts ?"
        : `${capitalize(
            Individu.label(individu, "nom")
          )} figure-t-il/elle sur votre dernière déclaration d'impôts sur le revenu ?`
    },
    questionType: "enum",
  }),

  _firstName: new TextProperty({
    question:
      "Quel est le prénom de votre enfant ? Il servira uniquement à vous faciliter la saisie par la suite.",
  }),

  enfant_place: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(
        individu,
        "être"
      )} placé·e en structure spécialisée ou famille d'accueil ?`
    },
  }),

  _interetAidesSanitaireSocial: new BooleanProperty({
    question:
      "Êtes-vous intéressé·e par les aides concernant les formations du secteur sanitaire et social ?",
  }),

  garde_alternee: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en garde alternée ?`
    },
  }),

  _interetBafa: new BooleanProperty({
    question: `Prévoyez-vous de passer le <abbr title="Brevet d'aptitude aux fonctions d'animateur">BAFA</abbr> ou le <abbr title="Brevet d'aptitude aux fonctions de directeur">BAFD</abbr> ?`,
  }),

  gir: new EnumProperty({
    items: [
      {
        label: "Jamais",
        value: "gir_6",
      },
      {
        label: "Ponctuellement",
        value: "gir_5",
      },
      {
        label: "Régulièrement",
        value: "gir_1",
      },
    ],
    question: ({ individu }) => {
      return `${Individu.label(individu, "avoir")} besoin d’une aide à la
      personne ?`
    },
    questionType: "enum",
  }),

  _interetEtudesEtranger: new BooleanProperty({
    question:
      "Prévoyez-vous de partir à l'étranger dans le cadre de vos études ?",
  }),

  groupe_specialites_formation: new EnumProperty({
    items: Object.values(Scolarite.groupeSpecialitesFormation),
    question: "De quel secteur votre formation fait-elle partie ?",
    questionType: "enum",
  }),

  _interetPermisDeConduire: new BooleanProperty({
    question: "Prévoyez-vous de passer le permis de conduire ?",
  }),

  habite_chez_parents: new BooleanProperty({
    question: "Êtes-vous hébergé chez vos parents ?",
  }),

  _interetsAidesVelo: new MultipleProperty({
    items: [
      { label: "Vélo mécanique simple", value: "velo_mecanique" },
      { label: "Vélo électrique", value: "velo_electrique" },
      { label: "Vélo cargo", value: "velo_cargo" },
      { label: "Vélo cargo électrique", value: "velo_cargo_electrique" },
      { label: "Vélo pliant", value: "velo_pliant" },
      { label: "Motorisation d'un vélo classique", value: "velo_motorisation" },
    ],
    question: "Souhaitez-vous connaître les aides pour acheter un vélo ?",
  }),

  handicap: new BooleanProperty({
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
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en situation de handicap ?`
    },
  }),

  _nombreMoisDebutContratDeTravail: new EnumProperty({
    items: [
      {
        label: "Moins de 3 mois",
        value: 2,
      },
      {
        isRelevant: ({ individu, periods }) => {
          return Individu.age(individu, periods.today.value) <= 25
        },
        label: "Entre 3 et 6 mois",
        value: 5,
      },
      {
        isRelevant: ({ individu, periods }) => {
          return Individu.age(individu, periods.today.value) > 25
        },
        label: "Plus de 3 mois",
        value: 12,
      },
      {
        isRelevant: ({ individu, periods }) => {
          return Individu.age(individu, periods.today.value) <= 25
        },
        label: "Plus 6 mois",
        value: 12,
      },
    ],
    question: ({ individu }) => {
      return individu.activite === "etudiant" && individu.alternant
        ? "Depuis quand avez-vous signé votre contrat d'alternance ?"
        : "Depuis quand avez-vous signé votre contrat de travail ?"
    },
    questionType: "enum",
  }),

  inapte_travail: new BooleanProperty({
    moreInfo:
      "Vous pouvez être « inapte au travail » après un accident ou une maladie. C'est le médecin du travail qui détermine cela.",
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} reconnu·e inapte au travail ?`
    },
  }),

  mention_baccalaureat: new EnumProperty({
    items: Scolarite.mentionsBaccalaureat,
    question: "Avez-vous obtenu une mention au baccalauréat ?",
    questionType: "enum",
  }),

  nationalite: new EnumProperty({
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
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? "Quelle est votre nationalité ?"
        : `Quelle est la nationalité ${Individu.label(
            individu,
            "préposition"
          )}${Individu.label(individu, "nom")} ?`
    },
    questionType: "enum",
  }),

  regime_securite_sociale: new EnumProperty({
    items: [
      {
        label: "Régime général (CAF/CPAM)",
        value: "regime_general",
      },
      {
        label: "Mutualité sociale agricole (MSA)",
        value: "regime_agricole",
      },
      {
        label: "Autre",
        value: "autres_regimes",
      },
      {
        label: "Je ne sais pas",
        value: "inconnu",
      },
    ],
    question: ({ individu, periods }) => {
      return individu.enfant_a_charge[periods.thisYear.id]
        ? "Quel est le régime de protection sociale de vos parents ?"
        : "Quel est votre régime de protection sociale ?"
    },
    questionType: "enum",
  }),

  rsa_jeune_condition_heures_travail_remplie: new BooleanProperty({
    question: ({ individu, periods }) => {
      return `${Individu.label(individu, "avoir")} travaillé
      <abbr
        title="ou 3 214 heures (2 fois 1 607) couvertes par un contrat de travail."
        >au moins 2 ans</abbr
      >
      depuis ${yearsAgo(3, periods.today.id)} ?`
    },
  }),

  scolarite: new EnumProperty({
    items: Scolarite.types,
    moreInfo:
      "Pour les étudiants en classes préparatoires aux grandes écoles, il faut sélectionner « Dans un établissement de l'enseignement supérieur ».",
    question: ({ individu }) => {
      return individu._role == "demandeur"
        ? "Où êtes-vous scolarisé·e ?"
        : `Où sera scolarisé·e ${individu._firstName} à la rentrée prochaine ?`
    },
    questionType: "enum",
  }),

  sortie_academie: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "avoir")} prévu d'étudier
      <a
        target="_blank"
        title="Académies - Nouvelle fenêtre"
        rel="noopener"
        href="https://www.education.gouv.fr/les-regions-academiques-academies-et-services-departementaux-de-l-education-nationale-6557"
        >hors de votre académie</a
      >
      l'an prochain ?`
    },
  }),

  sortie_region_academique: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "avoir")} prévu d'étudier
      <a
        target="_blank"
        title="Régions académiques - Nouvelle fenêtre"
        rel="noopener"
        href="https://www.etudiant.gouv.fr/fr/aide-la-mobilite-en-master-1504#item2"
        >hors de votre région académique</a
      >
      l'an prochain ?`
    },
  }),

  stagiaire: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en stage ?`
    },
  }),

  statut_marital: new EnumProperty({
    items: Individu.situationsFamiliales,
    question: "Quelle est votre relation avec votre conjoint·e ?",
    questionType: "enum",
  }),

  statuts_etablissement_scolaire: new EnumProperty({
    items: [
      {
        label: "Établissement public",
        value: "public",
      },
      {
        label: "Établissement privé sous contrat",
        value: "prive_sous_contrat",
      },
      {
        label: "Établissement privé hors contrat",
        value: "prive_hors_contrat",
      },
      {
        label: "Autre",
        value: "inconnu",
      },
    ],
    question: "Dans quel type d'établissement étudiez-vous actuellement ?",
    questionType: "enum",
  }),

  taux_incapacite: new EnumProperty({
    items: ({ openFiscaParameters }) => {
      const tauxMax =
        openFiscaParameters[
          "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite"
        ]
      return [
        {
          label: "Moins de 50%",
          value: 0.3,
        },
        {
          label: `Entre 50% et ${tauxMax * 100}%`,
          value: (0.5 + tauxMax) / 2,
        },
        {
          label: `Plus de ${tauxMax * 100}%`,
          value: (tauxMax + 1) / 2,
        },
      ]
    },
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
  }),
}
