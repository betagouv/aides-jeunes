import Individu from "@/lib/Individu"
import { capitalize, isRelevant, yearsAgo } from "@/lib/Utils"

export default {
  // TODO add date_naissance
  //TODO add date_debut_chomage

  aah_restriction_substantielle_durable_acces_emploi: {
    question: (component) => {
      return `${capitalize(
        component.getLabel("avoir")
      )} une restriction substantielle et
      durable d'accès à l'emploi reconnue par la
      <abbr
        title="Commission des droits et de l'autonomie des personnes handicapées"
        >CDAPH</abbr
      > ?`
    },
    questionType: "yesno",
    help: "Attention, cette restriction est différente de la reconnaissance de la qualité de travailleur handicapé.",
  },

  activite: {
    question: (component) => {
      return `${capitalize(component.getLabel("être"))} ?`
    },
    questionType: "enum",
    items: (component) => {
      let items = [
        {
          value: "etudiant",
          label: "Étudiant·e en formation ou alternance",
        },
        {
          value: "actif",
          label: "En activité salariée ou indépendante",
        },
        {
          value: "chomeur",
          label: "Inscrit·e comme demandeur d’emploi",
        },
        {
          value: "retraite",
          label: "Retraité·e",
          isRelevant: (component) =>
            Individu.age(
              component.individu,
              component.$store.state.dates.today.value
            ) > 30,
        },
        {
          value: "inactif",
          label: "Autre",
        },
      ]
      return isRelevant(items, component)
    },
  },

  aide_mobilite_master_sortie_region_academique: {
    question: (component) => {
      return `${capitalize(component.getLabel("avoir"))} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.etudiant.gouv.fr/fr/aide-la-mobilite-en-master-1504#item2"
        >hors de votre région académique</a
      >
      l'an prochain ?`
    },
    questionType: "yesno",
  },

  aide_mobilite_parcoursup_boursier_lycee: {
    question: "Actuellement bénéficiez-vous d'une bourse du lycée ?",
    questionType: "yesno",
  },

  aide_mobilite_parcoursup_sortie_academie: {
    question: (component) => {
      return `${capitalize(component.getLabel("avoir"))} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.education.gouv.fr/les-regions-academiques-academies-et-services-departementaux-de-l-education-nationale-6557"
        >hors de votre académie</a
      >
      l'an prochain ?`
    },
    questionType: "yesno",
  },

  alternant: {
    question: (component) => {
      return `${capitalize(component.getLabel("être"))} en alternance ?`
    },
    questionType: "yesno",
  },

  ass_precondition_remplie: {
    question: (component) => {
      return `${capitalize(component.getLabel("avoir"))} travaillé
      <abbr
        title="1825 jours (5 fois 365) couverts par un contrat de travail, en activité ou en congés."
        >au moins 5 ans</abbr
      >
      entre ${yearsAgo(
        10,
        component.individu.date_debut_chomage
      )} et ${yearsAgo(0, component.individu.date_debut_chomage)} ?`
    },
    questionType: "yesno",
  },

  boursier: {
    question: "Bénéficiez-vous d'une bourse de l'enseignement supérieur ?",
    questionType: "yesno",
  },

  classe_scolarite: {
    question: (component) => {
      return component.role == "demandeur"
        ? "Où êtes-vous scolarisé·e"
        : `Où sera scolarisé·e ${component.individu._firstName} à la rentrée prochaine`
    },
    questionType: "enum",
    items: (component) => {
      return [
        {
          value: "terminale",
          label: "Terminale",
          only: "lycee",
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
          label: "Autre",
          value: "autre",
        },
      ].filter(
        (item) => !item.only || item.only == component.individu.scolarite
      )
    },
  },

  enfant_place: {
    question: (component) => {
      return `${capitalize(
        component.getLabel("être")
      )} placé·e en structure spécialisée ou famille d'accueil ?`
    },
  },

  garde_alternee: {
    question: (component) => {
      return `${capitalize(component.getLabel("être"))} en garde alternée ?`
    },
    questionType: "yesno",
  },

  gir: {
    question: (component) => {
      return `${capitalize(component.getLabel("être"))} besoin d’une aide à la
      personne ?`
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
    question: "Êtes-vous hébergé chez vos parents ?",
    questionType: "yesno",
  },

  handicap: {
    question: (component) => {
      return `${capitalize(
        component.getLabel("être")
      )} en situation de handicap ?`
    },
    questionType: "yesno",
    enSavoirPlus: true,
  },

  inapte_travail: {
    question: (component) => {
      return `${capitalize(
        component.getLabel("être")
      )} reconnu·e inapte au travail ?`
    },
    questionType: "yesno",
    enSavoirPlus: true,
  },

  nationalite: {
    question: (component) => {
      return component.role === "demandeur"
        ? "Quelle est votre nationalité ?"
        : `Quelle est la nationalité ${component.getLabel(
            "préposition"
          )}${component.getLabel("nom")} ?`
    },
    questionType: "enum",
    items: [
      {
        label: "Française",
        value: "fr",
      },
      {
        label: "Européenne",
        value: "ue",
      },
      {
        label: "Non européenne",
        value: "autre",
      },
    ],
  },

  scolarite: {
    question: (component) => {
      return component.role == "demandeur"
        ? "Où êtes-vous scolarisé·e"
        : `Où sera scolarisé·e ${component.individu._firstName} à la rentrée prochaine`
    },
    questionType: "enum",
    items: [
      {
        value: "college",
        label: "Au collège",
      },
      {
        value: "lycee",
        label: "Au lycée / En CAP / En CPA",
      },
      {
        value: "enseignement_superieur",
        label: "Dans un établissement de l'enseignement supérieur",
      },
      {
        value: "grande_ecole_du_numerique",
        label: "Dans une grande école du numérique",
      },
      {
        value: "inconnue",
        label: "Autre",
      },
    ],
  },

  statuts_etablissement_scolaire: {
    question: "Dans quel type d'établissement étudiez-vous actuellement ?",
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

  taux_incapacite: {
    question: (component) => {
      const start =
        component.role === "demandeur"
          ? `Quel est votre taux d'incapacité`
          : `Quel est le taux d'incapacité ${component.getLabel(
              "préposition"
            )}${component.getLabel("nom")}`

      return `${start}
          évalué par ${component.getLabel("possessive")}
          <abbr title="Maison départementale des personnes handicapées"
            >MDPH</abbr
          > ?`
    },
    questionType: "enum",
    items: [
      {
        value: 0.3,
        label: "Moins de 50%",
      },
      {
        value: 0.7,
        label: "Entre 50% et 80%",
      },
      {
        value: 0.9,
        label: "Plus de 80%",
      },
    ],
  },

  rsa_jeune_condition_heures_travail_remplie: {
    question: (component) => {
      return `${capitalize(component.getLabel("avoir"))} travaillé
      <abbr
        title="ou 3 214 heures (2 fois 1 607) couvertes par un contrat de travail."
        >au moins 2 ans</abbr
      >
      depuis ${yearsAgo(3, component.$store.state.dates.today.id)} ?`
    },
    questionType: "yesno",
  },

  _interetPermisDeConduire: {
    question: "Prévoyez-vous de passer le permis de conduire ?",
    questionType: "yesno",
  },
}
