import { EnumProperty, BooleanProperty } from "./property"
import { getAnswer } from "../answers"

export default {
  coloc: new BooleanProperty({
    question: "Est-ce une colocation ?",
  }),

  logement_chambre: new BooleanProperty({
    question: `Est-ce une chambre ?
      <span class="help">
        Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipé d'un WC.
      </span>`,
  }),

  participation_frais: new BooleanProperty({
    question: `Participez-vous aux frais du logement ?
      <span class="help"
        >Par exemple aux dépenses d'électricité, de téléphone, etc.</span
      >`,
  }),

  _nombreMoisEntreeLogement: new EnumProperty({
    question: "Prévoyez-vous de déménager prochainement ?",
    questionType: "enum",
    items: [
      { value: 12, label: "Oui" },
      {
        value: -2,
        label: "Non, j'ai emmenagé il y a moins de 3 mois",
        isRelevant: ({ simulation }) => {
          const value = getAnswer(
            simulation.answers.current,
            "menage",
            "statut_occupation_logement"
          )
          return value?.startsWith("locataire")
        },
      },
      { value: -12, label: "Non" },
    ],
  }),
  statut_occupation_logement: new EnumProperty({
    question: "Êtes-vous ?",
    questionType: "enum",
    items: [
      {
        label: "Locataire",
        value: "locataire",
        hint: "figurant sur le bail, en foyer ou en résidence",
      },
      {
        label: "Propriétaire",
        value: "proprietaire",
        hint: "ou en location-accession",
      },
      {
        label: "Hébergé·e",
        value: "heberge",
        hint: "chez vos parents, chez un particulier ou en logement de fonction",
      },
      {
        label: "Sans domicile stable",
        value: "sansDomicile",
        hint: "ou domiciliation administrative",
      },
    ],
  }),
  _primo_accedant: new BooleanProperty({
    question: `Êtes-vous primo-accédant pour cette propriété ? </br>
      <span class="help"
        >Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire de sa résidence principale dans les deux années qui viennent de s’écouler au moment où il achète son bien.</span
      >`,
  }),
  _locataire_type: new EnumProperty({
    question: "Quel type de logement louez-vous ?",
    items: [
      {
        label: "Non meublé",
        value: "nonmeuble",
      },
      {
        label: "Meublé / Hôtel",
        value: "meublehotel",
      },
      {
        label: "Foyer",
        value: "foyer",
        hint: (activite, demandeurAge) => {
          return [
            ...(activite == "etudiant"
              ? ["résidence universitaire", "logement CROUS"]
              : []),
            demandeurAge > 50 ? "maison de retraite" : "",
            "foyer de jeune travailleur",
            "résidence sociale…",
          ]
            .filter((present) => present)
            .join(", ")
        },
      },
    ],
  }),
}
