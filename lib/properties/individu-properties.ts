import {
  TextProperty,
  DateProperty,
  EnumProperty,
  MultipleProperty,
  NumberProperty,
  BooleanProperty,
} from "./property.js"

import IndividuMethods from "../individu.js"
import { capitalize, yearsAgo } from "../utils.js"
import ScolariteCategories from "../scolarite.js"
import { getAnswer } from "../answers.js"

import { Activite } from "../enums/activite.js"
import { Etudiant, Scolarite } from "../enums/scolarite.js"
import { Velo } from "../enums/velo.js"
import {
  EuropeanCountryCode,
  NonEuropeanCountryCode,
} from "../../lib/enums/nationality.js"

export default {
  aah_restriction_substantielle_durable_acces_emploi: new BooleanProperty({
    question: ({ individu }) => {
      return `${IndividuMethods.label(
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
      return `${IndividuMethods.label(individu, "être")} ?`
    },
    items: [
      {
        value: Activite.Etudiant,
        label: "En étude ou en alternance",
      },
      {
        value: Activite.Salarie,
        label: "Salarié ou salariée",
      },
      {
        value: Activite.Independant,
        label: "Indépendant ou indépendante",
      },
      {
        value: Activite.Chomeur,
        label: "Inscrit ou inscrite comme demandeur d’emploi",
      },
      {
        value: Activite.Retraite,
        label: "Retraité ou retraitée",
        isRelevant: ({ individu, periods }) =>
          IndividuMethods.age(individu, periods.today.value) > 30,
      },
      {
        value: Activite.Inactif,
        label: "Autre",
      },
    ],
    moreInfo:
      "Lorsque vous étudiez et que vous travaillez, vous devez sélectionner « En étude ou en alternance ».",
  }),

  service_civique: new BooleanProperty({
    question: ({ individu }) => {
      return `${IndividuMethods.label(individu, "être")} en service civique ?`
    },
  }),

  alternant: new BooleanProperty({
    question: ({ individu }) => {
      return `${IndividuMethods.label(individu, "être")} en alternance ?`
    },
  }),

  annee_etude: new EnumProperty({
    question: "Dans quelle classe êtes-vous actuellement ?",
    items: [
      {
        label: "CAP - 1ère année",
        value: Etudiant.Cap1,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.Lycee
        },
      },
      {
        label: "CAP - 2ème année",
        value: Etudiant.Cap2,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.Lycee
        },
      },
      {
        label: "Seconde",
        value: Etudiant.Seconde,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.Lycee
        },
      },
      {
        label: "Première",
        value: Etudiant.Premiere,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.Lycee
        },
      },
      {
        label: "Terminale",
        value: Etudiant.Terminale,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.Lycee
        },
      },
      {
        label: "BTS",
        value: Etudiant.Bts1,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "BUT",
        value: Etudiant.But1,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "CPGE",
        value: Etudiant.Cpge1,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Licence - 1ère année",
        value: Etudiant.Licence1,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Licence - 2ème année",
        value: Etudiant.Licence2,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Licence - 3ème année",
        value: Etudiant.Licence3,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Master - 1ère année",
        value: Etudiant.Master1,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Master - 2ème année",
        value: Etudiant.Master2,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Doctorat - 1ère année",
        value: Etudiant.Doctorat1,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Doctorat - 2ème année",
        value: Etudiant.Doctorat2,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Doctorat - 3ème année",
        value: Etudiant.Doctorat3,
        isRelevant({ individu }) {
          return individu.scolarite === Scolarite.EnseignementSuperieur
        },
      },
      {
        label: "Autre",
        value: Etudiant.Autre,
      },
    ],
  }),

  ass_precondition_remplie: new BooleanProperty({
    question: ({ individu }) => {
      const date_debut_chomage = individu.date_debut_chomage
      return `${IndividuMethods.label(individu, "avoir")} travaillé
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
      "Lorsque vos parents sont séparés, il faut prendre les ressources du parent qui vous a à charge. Si vous êtes encore mineur et en garde alternée, il faut faire la somme des ressources des deux foyers fiscaux des parents séparés.",
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
      return `Quand ${IndividuMethods.label(
        individu,
        "avoir"
      )} commencé à être au chômage ?`
    },
  }),

  date_naissance: new DateProperty({
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? `Quelle est votre date de naissance ?`
        : `Quelle est la date de naissance ${IndividuMethods.label(
            individu,
            "préposition"
          )}${IndividuMethods.label(individu, "nom")} ?`
    },
  }),

  enceinte: new EnumProperty({
    question: ({ individu }) => {
      return `${
        individu._role === "demandeur"
          ? "Portez-vous actuellement un enfant ?"
          : "Est-ce que votre partenaire porte actuellement un enfant ?"
      }`
    },
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
  }),

  enfant_a_charge: new EnumProperty({
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? "Avez-vous fait votre propre déclaration d'impôts ?"
        : `${capitalize(
            IndividuMethods.label(individu, "nom")
          )} figure-t-il/elle sur votre dernière déclaration d'impôts sur le revenu ?`
    },
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
      return `${IndividuMethods.label(
        individu,
        "être"
      )} placé ou placée en structure spécialisée ou famille d'accueil ?`
    },
  }),

  garde_alternee: new BooleanProperty({
    question: ({ individu }) => {
      return `${IndividuMethods.label(individu, "être")} en garde alternée ?`
    },
  }),

  gir: new EnumProperty({
    question: ({ individu }) => {
      return `${IndividuMethods.label(individu, "avoir")} besoin d’une aide à la
      personne ?`
    },
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
    items: Object.values(ScolariteCategories.groupeSpecialitesFormation),
  }),

  habite_chez_parents: new BooleanProperty({
    question: "Êtes-vous hébergé chez vos parents ?",
  }),

  handicap: new BooleanProperty({
    question: ({ individu }) => {
      return `${IndividuMethods.label(
        individu,
        "être"
      )} en situation de handicap ?`
    },
    moreInfo: (variation) => {
      if (variation?.includes("enfant")) {
        return `Votre enfant est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci lui a également attribué un « taux d'incapacité » lié à son handicap.`
      } else if (variation?.includes("conjoint")) {
        return `Votre conjoint est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci lui a également attribué un « taux d'incapacité » lié à son handicap.`
      } else {
        return `Vous êtes « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci vous a également attribué un « taux d'incapacité » lié à votre handicap.`
      }
    },
  }),

  inapte_travail: new BooleanProperty({
    question: ({ individu }) => {
      return `${IndividuMethods.label(
        individu,
        "être"
      )} reconnu ou reconnue inapte au travail ?`
    },
    moreInfo:
      "Vous pouvez être « inapte au travail » après un accident ou une maladie. C'est le médecin du travail qui détermine cela.",
  }),

  mention_baccalaureat: new EnumProperty({
    question: "Avez-vous obtenu une mention au baccalauréat ?",
    items: ScolariteCategories.mentionsBaccalaureat,
  }),

  nationalite: new EnumProperty({
    question: ({ individu }) => {
      return individu._role === "demandeur"
        ? "Quelle est votre nationalité ?"
        : `Quelle est la nationalité ${IndividuMethods.label(
            individu,
            "préposition"
          )}${IndividuMethods.label(individu, "nom")} ?`
    },
    items: [
      {
        label: "Française",
        value: EuropeanCountryCode.FR,
      },
      {
        label: "Européenne",
        value: EuropeanCountryCode.DE,
      },
      {
        label: "Non européenne",
        value: NonEuropeanCountryCode.AF,
      },
    ],
  }),

  regime_securite_sociale: new EnumProperty({
    question: ({ individu, periods }) => {
      return individu.enfant_a_charge[periods.thisYear.id]
        ? "Quel est le régime de protection sociale de vos parents ?"
        : "Quel est votre régime de protection sociale ?"
    },
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
      return `${IndividuMethods.label(individu, "avoir")} travaillé
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
        ? "Où êtes-vous scolarisé ou scolarisée ?"
        : `Où sera scolarisé ou scolarisée ${individu._firstName} à la rentrée prochaine ?`
    },
    items: ScolariteCategories.types,
    moreInfo:
      "Pour les étudiants en classes préparatoires aux grandes écoles, il faut sélectionner « Dans un établissement de l'enseignement supérieur ».",
  }),

  sortie_academie: new BooleanProperty({
    question: ({ individu }) => {
      return `${IndividuMethods.label(individu, "avoir")} prévu d'étudier
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
      return `${IndividuMethods.label(individu, "avoir")} prévu d'étudier
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
      return `${IndividuMethods.label(individu, "être")} en stage ?`
    },
  }),

  statuts_etablissement_scolaire: new EnumProperty({
    question: "Dans quel type d'établissement étudiez-vous actuellement ?",
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
    question: "Quelle est votre relation avec votre conjoint ou conjointe ?",
    items: IndividuMethods.situationsFamiliales,
  }),

  taux_incapacite: new EnumProperty({
    question: ({ individu }) => {
      const start =
        individu._role === "demandeur"
          ? `Quel est votre taux d'incapacité`
          : `Quel est le taux d'incapacité ${IndividuMethods.label(
              individu,
              "préposition"
            )}${IndividuMethods.label(individu, "nom")}`

      return `${start}
          évalué par ${IndividuMethods.label(individu, "possessive")}
          <abbr title="Maison départementale des personnes handicapées"
            >MDPH</abbr
          > ?`
    },
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
    items: [
      {
        value: Activite.Apprenti,
        label: "En apprentissage",
      },
      {
        value: Activite.Professionnalisation,
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
      { value: Velo.VeloMecanique, label: "Vélo mécanique simple" },
      { value: Velo.VeloElectrique, label: "Vélo électrique" },
      { value: Velo.VeloCargo, label: "Vélo cargo" },
      {
        value: Velo.VeloCargoElectrique,
        label: "Vélo cargo électrique",
      },
      { value: Velo.VeloPliant, label: "Vélo pliant" },
      {
        value: Velo.VeloMotorisation,
        label: "Motorisation d'un vélo classique",
      },
    ],
  }),

  _interetAidesSanitaireSocial: new BooleanProperty({
    question:
      "Êtes-vous intéressé ou intéressée par les aides concernant les formations du secteur sanitaire et social ?",
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
      return individu.activite === Activite.Etudiant && individu.alternant
        ? "Depuis quand avez-vous signé votre contrat d'alternance ?"
        : "Depuis quand avez-vous signé votre contrat de travail ?"
    },
    items: [
      {
        value: 2,
        label: "Moins de 3 mois",
      },
      {
        value: 5,
        label: "Entre 3 et 6 mois",
        isRelevant: ({ individu, periods }) => {
          return IndividuMethods.age(individu, periods.today.value) <= 25
        },
      },
      {
        value: 12,
        label: "Plus de 3 mois",
        isRelevant: ({ individu, periods }) => {
          return IndividuMethods.age(individu, periods.today.value) > 25
        },
      },
      {
        value: 12,
        label: "Plus 6 mois",
        isRelevant: ({ individu, periods }) => {
          return IndividuMethods.age(individu, periods.today.value) <= 25
        },
      },
    ],
  }),

  _agence_travail_temporaire: new BooleanProperty({
    question: () => {
      return `Travaillez-vous dans une agence de travail temporaire ?`
    },
  }),
}
