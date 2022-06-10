import { EnumProperty, Property } from "./property"

const { getAnswer } = require("../answers")

export default {
  coloc: new Property({
    question: "Est-ce une colocation ?",
  }),

  logement_chambre: new Property({
    question: `Est-ce une chambre ?
      <span class="help">
        Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipé d'un WC.
      </span>`,
  }),

  participation_frais: new Property({
    question: `Participez-vous aux frais du logement ?
      <span class="help"
        >Par exemple aux dépenses d'électricité, de téléphone, etc.</span
      >`,
  }),

  _nombreMoisEntreeLogement: new EnumProperty({
    question: "Prévoyez-vous de déménager prochainement ?",
    questionType: "enum",
    items: ({ simulation }) => {
      const value = getAnswer(
        simulation.answers.current,
        "menage",
        "statut_occupation_logement"
      )
      return [
        { value: 12, label: "Oui", active: true },
        {
          value: -2,
          label: "Non, j'ai emmenagé il y a moins de 3 mois",
          active: value?.startsWith("locataire"),
        },
        { value: -12, label: "Non", active: true },
      ].filter((item) => item.active)
    },
  }),
}
