import Individu from "@/lib/Individu"
import { isRelevant, yearsAgo } from "@/lib/Utils"

export default {
  aah_restriction_substantielle_durable_acces_emploi: {
    question: (component) => {
      return `${component.getLabel("avoir")} une restriction substantielle et
      durable d'accès à l'emploi reconnue par la
      <abbr
        title="Commission des droits et de l'autonomie des personnes handicapées"
        >CDAPH</abbr
      > ?`
    },
    help: "Attention, cette restriction est différente de la reconnaissance de la qualité de travailleur handicapé.",
  },

  activite: {
    question: (component) => {
      return `${component.getLabel("être")} ?`
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
      return `${component.getLabel("avoir")} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.etudiant.gouv.fr/fr/aide-la-mobilite-en-master-1504#item2"
        >hors de votre région académique</a
      >
      l'an prochain ?`
    },
  },

  aide_mobilite_parcoursup_boursier_lycee: {
    question: "Actuellement bénéficiez-vous d'une bourse du lycée ?",
  },

  aide_mobilite_parcoursup_sortie_academie: {
    question: (component) => {
      return `${component.getLabel("avoir")} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.education.gouv.fr/les-regions-academiques-academies-et-services-departementaux-de-l-education-nationale-6557"
        >hors de votre académie</a
      >
      l'an prochain ?`
    },
  },

  alternant: {
    question: (component) => {
      return `${component.getLabel("être")} en alternance ?`
    },
  },

  ass_precondition_remplie: {
    question: (component) => {
      const date_debut_chomage = component.individu.date_debut_chomage
      return `${component.getLabel("avoir")} travaillé
      <abbr
        title="1825 jours (5 fois 365) couverts par un contrat de travail, en activité ou en congés."
        >au moins 5 ans</abbr
      >
      entre ${yearsAgo(10, date_debut_chomage)}
      et ${yearsAgo(0, date_debut_chomage)} ?`
    },
  },

  boursier: {
    question: "Bénéficiez-vous d'une bourse de l'enseignement supérieur ?",
  },

  classe_scolarite: {
    question: "Dans quelle classe êtes-vous actuellement ?",
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
      return `${component.getLabel(
        "être"
      )} placé·e en structure spécialisée ou famille d'accueil ?`
    },
  },

  garde_alternee: {
    question: (component) => {
      return `${component.getLabel("être")} en garde alternée ?`
    },
  },

  gir: {
    question: (component) => {
      return `${component.getLabel("avoir")} besoin d’une aide à la
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
    question: (component) => {
      return `${component.getLabel("être")} en situation de handicap ?`
    },
  },

  inapte_travail: {
    question: (component) => {
      return `${component.getLabel("être")} reconnu·e inapte au travail ?`
    },
  },

  nationalite: {
    question: (component) => {
      return component.role === "demandeur"
        ? "Quelle est votre nationalité ?"
        : `Quelle est la nationalité ${component.getLabel(
            "préposition"
          )}${component.getLabel("nom")} ?`
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

  rsa_jeune_condition_heures_travail_remplie: {
    question: (component) => {
      return `${component.getLabel("avoir")} travaillé
      <abbr
        title="ou 3 214 heures (2 fois 1 607) couvertes par un contrat de travail."
        >au moins 2 ans</abbr
      >
      depuis ${yearsAgo(3, component.$store.state.dates.today.id)} ?`
    },
  },

  scolarite: {
    question: (component) => {
      return component.role == "demandeur"
        ? "Où êtes-vous scolarisé·e ?"
        : `Où sera scolarisé·e ${component.individu._firstName} à la rentrée prochaine ?`
    },
    questionType: "enum",
    items: Individu.scolariteOptions,
    enSavoirPlus: true,
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
          > ?`
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

  _diplome_2020_2021: {
    question:
      "Avez-vous obtenu un diplôme supérieur ou égal à un BAC +2 en 2020 ou 2021 ?",
  },

  _interetEtudesEtranger: {
    question:
      "Prévoyez-vous de partir à l'étranger dans le cadre de vos études ?",
  },

  _interetPermisDeConduire: {
    question: "Prévoyez-vous de passer le permis de conduire ?",
  },

  plus_haut_diplome_date_obtention: {
    type: Date,
    question: "À quelle date (approximative) avez-vous obtenu votre plus haut diplôme ?",
  },

  plus_haut_diplome_niveau: {
    question: "Quelle le niveau de votre plus haut diplôme ?",
    questionType: "enum",
    items: [
    {
    value: "niveau_3",
    label: "CAP, DNP, CFG",
    },
    {
    value: "niveau_4",
    label: "Baccalauréat",
    },
    {
    value: "niveau_5",
    label: "BTS, CPGE",
    },
    {
    value: "niveau_6",
    label: "Licence, BUT",
    },
    {
    value: "niveau_7",
    label: "Bac+5 Master",
    },
    {
    value: "niveau_8",
    label: "Bac+8 Doctorat",
    },
    {
    value: "non_renseigne",
    label: "Autre",
    },
    ],
  },

  _boursier_derniere_annee_etudes: {
    question: "Étiez-vous boursier lors de votre dernière année d'études ?"
  },

  _montant_mensuel_bourse_derniere_annee_etudes: {
    type: Number,
    question: "Quel montant mensuel de bourse receviez-vous lors de votre dernière année d'études ?"
  },

  _continuite_etudes: {
    question: "Avez-vous prévu de continuer vos études l'an prochain ?",
  }

}
