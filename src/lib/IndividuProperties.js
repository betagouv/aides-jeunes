import Individu from "@/lib/Individu"
import { isRelevant, yearsAgo } from "@/lib/Utils"
import Scolarite from "@/lib/Scolarite"

const loadEntity = (component) => {
  const params = component.params || component.$route.params
  const role = params.id.split("_")[0]
  const { individu } = Individu.get(
    component.$store.getters.peopleParentsFirst,
    role,
    params.id,
    component.$store.state.dates
  )
  return individu
}

const STEPS = {
  aah_restriction_substantielle_durable_acces_emploi: {
    question: (component) => {
      return `${Individu.label(
        component.entity,
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
    question: (component) => {
      return `${Individu.label(component.entity, "être")} ?`
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
          isRelevant: (component) =>
            Individu.age(
              component.entity,
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

  aide_jeunes_diplomes_anciens_boursiers_base_ressources: {
    question:
      "Quel montant mensuel de bourse receviez-vous lors de votre dernière année d'études ?",
    questionType: "number",
    unit: "€",
  },

  alternant: {
    question: (component) => {
      return `${Individu.label(component.entity, "être")} en alternance ?`
    },
  },

  ass_precondition_remplie: {
    question: (component) => {
      const date_debut_chomage = component.entity.date_debut_chomage
      return `${Individu.label(component.entity, "avoir")} travaillé
      <abbr
        title="1825 jours (5 fois 365) couverts par un contrat de travail, en activité ou en congés."
        >au moins 5 ans</abbr
      >
      entre ${yearsAgo(10, date_debut_chomage)}
      et ${yearsAgo(0, date_debut_chomage)} ?`
    },
  },

  bourse_criteres_sociaux_base_ressources_parentale: {
    question: (component) => {
      return `Quel est le revenu brut global ${yearsAgo(
        2,
        component.$store.state.dates.today.id,
        "YYYY"
      )} figurant sur l’avis fiscal ${yearsAgo(
        1,
        component.$store.state.dates.today.id,
        "YYYY"
      )} de vos parents ?`
    },
    questionType: "number",
    showMoreInfo: (component) => {
      return component.$store.state.situation.parents._situation === "separes"
    },
    unit: "€",
  },

  boursier: {
    question: "Bénéficiez-vous d'une bourse de l'enseignement supérieur ?",
  },

  annee_etude: {
    question: "Dans quelle classe êtes-vous actuellement ?",
    questionType: "enum",
    items: (component) => {
      return [
        {
          value: "seconde",
          label: "Seconde",
          only: "lycee",
        },
        {
          value: "premiere",
          label: "Première",
          only: "lycee",
        },
        {
          value: "terminale",
          label: "Terminale",
          only: "lycee",
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
      ].filter((item) => !item.only || item.only == component.entity.scolarite)
    },
  },

  date_naissance: {
    question: (component) => {
      return component.entity._role === "demandeur"
        ? `Quelle est votre date de naissance ?`
        : `Quelle est la date de naissance ${Individu.label(
            component.entity,
            "préposition"
          )}${Individu.label(component.entity, "nom")} ?`
    },
    questionType: "date",
  },

  date_debut_chomage: {
    question: (component) => {
      return `Quand ${Individu.label(
        component.entity,
        "avoir"
      )} commencé à être au chômage ?`
    },
    questionType: "date",
  },

  enfant_place: {
    question: (component) => {
      return `${Individu.label(
        component.entity,
        "être"
      )} placé·e en structure spécialisée ou famille d'accueil ?`
    },
  },

  garde_alternee: {
    question: (component) => {
      return `${Individu.label(component.entity, "être")} en garde alternée ?`
    },
  },

  gir: {
    question: (component) => {
      return `${Individu.label(
        component.entity,
        "avoir"
      )} besoin d’une aide à la
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
      return `${Individu.label(
        component.entity,
        "être"
      )} en situation de handicap ?`
    },
  },

  inapte_travail: {
    question: (component) => {
      return `${Individu.label(
        component.entity,
        "être"
      )} reconnu·e inapte au travail ?`
    },
  },

  mention_baccalaureat: {
    question: "Avez-vous obtenu une mention au baccalauréat ?",
    questionType: "enum",
    items: Scolarite.mentionsBaccalaureat,
  },

  nationalite: {
    question: (component) => {
      return component.entity._role === "demandeur"
        ? "Quelle est votre nationalité ?"
        : `Quelle est la nationalité ${Individu.label(
            component.entity,
            "préposition"
          )}${Individu.label(component.entity, "nom")} ?`
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

  plus_haut_diplome_date_obtention: {
    question: (component) => {
      return `Quand ${Individu.label(
        component.entity,
        "avoir"
      )} obtenu votre plus haut diplôme ?
      (approximativement)`
    },
    questionType: "date",
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
        label: "Aucun",
      },
    ],
  },

  rsa_jeune_condition_heures_travail_remplie: {
    question: (component) => {
      return `${Individu.label(component.entity, "avoir")} travaillé
      <abbr
        title="ou 3 214 heures (2 fois 1 607) couvertes par un contrat de travail."
        >au moins 2 ans</abbr
      >
      depuis ${yearsAgo(3, component.$store.state.dates.today.id)} ?`
    },
  },

  scolarite: {
    question: (component) => {
      return component.entity._role == "demandeur"
        ? "Où êtes-vous scolarisé·e ?"
        : `Où sera scolarisé·e ${component.entity._firstName} à la rentrée prochaine ?`
    },
    questionType: "enum",
    items: Scolarite.types,
    enSavoirPlus: true,
  },
  sortie_academie: {
    question: (component) => {
      return `${Individu.label(component.entity, "avoir")} prévu d'étudier
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
    question: (component) => {
      return `${Individu.label(component.entity, "avoir")} prévu d'étudier
      <a
        target="_blank"
        rel="noopener"
        href="https://www.etudiant.gouv.fr/fr/aide-la-mobilite-en-master-1504#item2"
        >hors de votre région académique</a
      >
      l'an prochain ?`
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
  taux_incapacite: {
    question: (component) => {
      const start =
        component.entity._role === "demandeur"
          ? `Quel est votre taux d'incapacité`
          : `Quel est le taux d'incapacité ${Individu.label(
              component.entity,
              "préposition"
            )}${Individu.label(component.entity, "nom")}`

      return `${start}
          évalué par ${Individu.label(component.entity, "possessive")}
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

  _boursier_derniere_annee_etudes: {
    question: "Étiez-vous boursier lors de votre dernière année d'études ?",
  },

  _continuite_etudes: {
    question: "Avez-vous prévu de continuer vos études l'an prochain ?",
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
  },

  _interetEtudesEtranger: {
    question:
      "Prévoyez-vous de partir à l'étranger dans le cadre de vos études ?",
  },

  _interetPermisDeConduire: {
    question: "Prévoyez-vous de passer le permis de conduire ?",
  },

  _nombreMoisDebutContratDeTravail: {
    question: (component) => {
      return component.entity.activite === "etudiant" &&
        component.entity.alternant
        ? "Depuis quand avez-vous signé votre contrat d'alternance ?"
        : "Depuis quand avez-vous signé votre contrat de travail ?"
    },
    questionType: "enum",
    items: (component) => {
      const jeune_actif =
        Individu.age(
          component.entity,
          component.$store.state.dates.today.value
        ) <= 25
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

export default {
  loadEntity,
  STEPS,
}
