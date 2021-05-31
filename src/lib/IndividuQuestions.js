import Individu from "@/lib/Individu"
import { capitalize, isRelevant, yearsAgo } from "@/lib/Utils"

export default {
  // TODO add date_naissance

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

  alternant: {
    question: (component) => {
      return `${capitalize(component.getLabel("être"))} en alternance ?`
    },
    questionType: "yesno",
  },

  //TODO add date_debut_chomage

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

  inapte_travail: {
    question: (component) => {
      return `${capitalize(
        component.getLabel("être")
      )} reconnu·e inapte au travail ?`
    },
    questionType: "yesno",
    enSavoirPlus: true,
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
}
