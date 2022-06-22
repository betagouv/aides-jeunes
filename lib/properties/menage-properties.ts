import { EnumProperty, YesNoProperty } from "./property"

const { getAnswer } = require("../answers")

export default {
  coloc: new YesNoProperty({
    question: "Est-ce une colocation ?",
  }),

  logement_chambre: new YesNoProperty({
    question: `Est-ce une chambre ?
      <span class="help">
        Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipé d'un WC.
      </span>`,
  }),

  participation_frais: new YesNoProperty({
    question: `Participez-vous aux frais du logement ?
      <span class="help"
        >Par exemple aux dépenses d'électricité, de téléphone, etc.</span
      >`,
  }),

  _nombreMoisEntreeLogement: new EnumProperty({
    question: "Prévoyez-vous de déménager prochainement ?",
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
}
