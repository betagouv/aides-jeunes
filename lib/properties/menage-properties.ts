import { EnumProperty, BooleanProperty } from "./property.js"
import { getAnswer } from "../answers.js"

export default {
  _nombreMoisEntreeLogement: new EnumProperty({
    items: [
      { label: "Oui", value: 12 },
      {
        isRelevant: ({ simulation }) => {
          const value = getAnswer(
            simulation.answers.current,
            "menage",
            "statut_occupation_logement"
          )
          return value?.startsWith("locataire")
        },
        label: "Non, j'ai emmenagé il y a moins de 3 mois",
        value: -2,
      },
      { label: "Non", value: -12 },
    ],
    question: "Prévoyez-vous de déménager prochainement ?",
    questionType: "enum",
  }),

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
}
