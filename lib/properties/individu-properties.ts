import {
  TextProperty,
  DateProperty,
  EnumProperty,
  MultipleProperty,
  NumberProperty,
  BooleanProperty,
  SliderProperty,
} from "./property.js"

import Individu from "../individu.js"
import { capitalize, yearsAgo } from "../utils.js"
import Scolarite from "../scolarite.js"
import { getAnswer } from "../answers.js"

import { ActiviteType } from "../enums/activite.js"
import { EtudiantType, ScolariteType } from "../enums/scolarite.js"

export default {
  aah_restriction_substantielle_durable_acces_emploi: new BooleanProperty({
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
  }),

  activite: new EnumProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} ?`
    },
    questionType: "enum",
    items: [
      {
        value: ActiviteType.etudiant,
        label: "Scolarisé·e, étudiant·e, alternant·e",
      },
      {
        value: ActiviteType.salarie,
        label: "Salarié·e",
      },
      {
        value: ActiviteType.independant,
        label: "Indépendant·e",
      },
      {
        value: ActiviteType.service_civique,
        label: "En service civique",
      },
      {
        value: ActiviteType.chomeur,
        label: "Inscrit·e comme demandeur d’emploi",
      },
      {
        value: ActiviteType.retraite,
        label: "Retraité·e",
        isRelevant: ({ individu, periods }) =>
          Individu.age(individu, periods.today.value) > 30,
      },
      {
        value: ActiviteType.inactif,
        label: "Autre",
      },
    ],
    moreInfo:
      "Lorsque vous êtes étudiant·e salarié·e, vous devez sélectionner « Étudiant·e en formation ou alternance ».",
  }),

  alternant: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en alternance ?`
    },
  }),

  annee_etude: new EnumProperty({
    question: "Dans quelle classe êtes-vous actuellement ?",
    questionType: "enum",
    items: [
      {
        label: "CAP - 1ère année",
        value: EtudiantType.cap_1,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.lycee
        },
      },
      {
        label: "CAP - 2ème année",
        value: EtudiantType.cap_2,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.lycee
        },
      },
      {
        label: "Seconde",
        value: EtudiantType.seconde,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.lycee
        },
      },
      {
        label: "Première",
        value: EtudiantType.premiere,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.lycee
        },
      },
      {
        label: "Terminale",
        value: EtudiantType.terminale,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.lycee
        },
      },
      {
        label: "BTS",
        value: EtudiantType.bts_1,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "BUT",
        value: EtudiantType.but_1,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "CPGE",
        value: EtudiantType.cpge_1,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Licence - 1ère année",
        value: EtudiantType.licence_1,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Licence - 2ème année",
        value: EtudiantType.licence_2,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Licence - 3ème année",
        value: EtudiantType.licence_3,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Master - 1ère année",
        value: EtudiantType.master_1,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Master - 2ème année",
        value: EtudiantType.master_2,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Doctorat - 1ère année",
        value: EtudiantType.doctorat_1,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Doctorat - 2ème année",
        value: EtudiantType.doctorat_2,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Doctorat - 3ème année",
        value: EtudiantType.doctorat_3,
        isRelevant({ individu }) {
          return individu.scolarite === ScolariteType.enseignement_superieur
        },
      },
      {
        label: "Autre",
        value: EtudiantType.autre,
      },
    ],
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
      return ["separes", "celibataire"].includes(_situation)
    },
    unit: "€",
  }),

  boursier: new BooleanProperty({
    question: "Bénéficiez-vous d'une bourse de l'enseignement supérieur ?",
  }),

  categorie_salarie: new EnumProperty({
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

  bourse_criteres_sociaux_echelon: new SliderProperty({
    question: "Si vous êtes boursier, à quel échelon êtes-vous ?",
    questionType: "slider",
    min: -1,
    max: 7,
    items: [
      {
        label: "Non boursier",
        value: -1,
      },
      {
        label: "Boursier échelon 0",
        value: 0,
      },
      {
        label: "Boursier échelon 1",
        value: 1,
      },
      {
        label: "Boursier échelon 2",
        value: 2,
      },
      {
        label: "Boursier échelon 3",
        value: 3,
      },
      {
        label: "Boursier échelon 4",
        value: 4,
      },
      {
        label: "Boursier échelon 5",
        value: 5,
      },
      {
        label: "Boursier échelon 6",
        value: 6,
      },
      {
        label: "Boursier échelon 7",
        value: 7,
      },
    ],
  }),

  enceinte: new EnumProperty({
    question: ({ individu }) => {
      return `${
        individu._role === "demandeur"
          ? "Êtes-vous enceint·e ?"
          : "Est-ce que votre partenaire est enceint·e ?"
      }`
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
        label: "Pas concerné·e",
        value: "pas_concerne",
      },
    ],
  }),

  enfant_a_charge: new EnumProperty({
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
  }),

  enfant_place: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(
        individu,
        "être"
      )} placé·e en structure spécialisée ou famille d'accueil ?`
    },
  }),

  garde_alternee: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} en garde alternée ?`
    },
  }),

  gir: new EnumProperty({
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
  }),

  groupe_specialites_formation: new EnumProperty({
    question: "De quel secteur votre formation fait-elle partie ?",
    questionType: "enum",
    items: Object.values(Scolarite.groupeSpecialitesFormation),
  }),

  habite_chez_parents: new BooleanProperty({
    question: "Êtes-vous hébergé chez vos parents ?",
  }),

  handicap: new BooleanProperty({
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
  }),

  inapte_travail: new BooleanProperty({
    question: ({ individu }) => {
      return `${Individu.label(individu, "être")} reconnu·e inapte au travail ?`
    },
    moreInfo:
      "Vous pouvez être « inapte au travail » après un accident ou une maladie. C'est le médecin du travail qui détermine cela.",
  }),

  mention_baccalaureat: new EnumProperty({
    question: "Avez-vous obtenu une mention au baccalauréat ?",
    questionType: "enum",
    items: Scolarite.mentionsBaccalaureat,
  }),

  nationalite: new EnumProperty({
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
  }),

  regime_securite_sociale: new EnumProperty({
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
    question: ({ individu }) => {
      return individu._role == "demandeur"
        ? "Où êtes-vous scolarisé·e ?"
        : `Où sera scolarisé·e ${individu._firstName} à la rentrée prochaine ?`
    },
    questionType: "enum",
    items: Scolarite.types,
    moreInfo:
      "Pour les étudiants en classes préparatoires aux grandes écoles, il faut sélectionner « Dans un établissement de l'enseignement supérieur ».",
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

  statuts_etablissement_scolaire: new EnumProperty({
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
  }),

  statut_marital: new EnumProperty({
    question: "Quelle est votre relation avec votre conjoint·e ?",
    questionType: "enum",
    items: Individu.situationsFamiliales,
  }),

  taux_incapacite: new EnumProperty({
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
          label: `De 50% à ${(tauxMax - 0.01) * 100}%`,
        },
        {
          value: (tauxMax + 1) / 2,
          label: `${tauxMax * 100}% et plus`,
        },
      ]
    },
  }),

  _contrat_alternant: new EnumProperty({
    question: "Êtes-vous ?",
    questionType: "enum",
    items: [
      {
        value: ActiviteType.apprenti,
        label: "En apprentissage",
      },
      {
        value: ActiviteType.professionnalisation,
        label: "En contrat de professionnalisation",
      },
    ],
  }),

  _dureeMoisEtudesEtranger: new NumberProperty({
    question:
      "Combien de mois envisagez-vous de partir à l'étranger dans le cadre de vos études ?",
    unit: "mois",
    type: "count",
  }),

  _firstName: new TextProperty({
    question:
      "Quel est le prénom de votre enfant ? Il servira uniquement à vous faciliter la saisie par la suite.",
  }),

  _interetsAidesVelo: new MultipleProperty({
    question: "Souhaitez-vous connaître les aides pour acheter un vélo ?",
    items: [
      { value: "velo_mecanique", label: "Vélo mécanique simple" },
      { value: "velo_electrique", label: "Vélo électrique" },
      { value: "velo_cargo", label: "Vélo cargo" },
      { value: "velo_cargo_electrique", label: "Vélo cargo électrique" },
      { value: "velo_pliant", label: "Vélo pliant" },
      { value: "velo_motorisation", label: "Motorisation d'un vélo classique" },
    ],
  }),

  _interetAidesSanitaireSocial: new BooleanProperty({
    question:
      "Êtes-vous intéressé·e par les aides concernant les formations du secteur sanitaire et social ?",
  }),

  _interetBafa: new BooleanProperty({
    question: `Souhaitez-vous connaître les aides au <abbr title="Brevet d'aptitude aux fonctions d'animateur">BAFA</abbr> et au <abbr title="Brevet d'aptitude aux fonctions de directeur">BAFD</abbr> ?`,
  }),

  _interetEtudesEtranger: new BooleanProperty({
    question:
      "Prévoyez-vous de partir à l'étranger dans le cadre de vos études ?",
  }),

  _interetPermisDeConduire: new BooleanProperty({
    question: "Prévoyez-vous de passer le permis de conduire ?",
  }),

  _nombreMoisDebutContratDeTravail: new EnumProperty({
    question: ({ individu }) => {
      return individu.activite === ActiviteType.etudiant && individu.alternant
        ? "Depuis quand avez-vous signé votre contrat d'alternance ?"
        : "Depuis quand avez-vous signé votre contrat de travail ?"
    },
    questionType: "enum",
    items: [
      {
        value: 2,
        label: "Moins de 3 mois",
      },
      {
        value: 5,
        label: "Entre 3 et 6 mois",
        isRelevant: ({ individu, periods }) => {
          return Individu.age(individu, periods.today.value) <= 25
        },
      },
      {
        value: 12,
        label: "Plus de 3 mois",
        isRelevant: ({ individu, periods }) => {
          return Individu.age(individu, periods.today.value) > 25
        },
      },
      {
        value: 12,
        label: "Plus 6 mois",
        isRelevant: ({ individu, periods }) => {
          return Individu.age(individu, periods.today.value) <= 25
        },
      },
    ],
  }),
}
