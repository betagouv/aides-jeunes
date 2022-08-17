import { EnumProperty, NumberProperty, BooleanProperty } from "./property.js"
import { yearsAgo } from "../utils.js"

export default {
  bourse_criteres_sociaux_nombre_enfants_a_charge: new NumberProperty({
    min: 1,
    question:
      "Combien d'enfants (vous y compris) sont à la charge de vos parents ?",
    questionType: "number",
    type: "count",
  }),

  bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur:
    new NumberProperty({
      min: 0,
      question: "Et combien (vous y compris) font des études supérieures ?",
      questionType: "number",
      type: "count",
    }),

  bourse_lycee: new BooleanProperty({
    question: "Actuellement bénéficiez-vous d'une bourse du lycée ?",
  }),

  en_couple: new EnumProperty({
    items: [
      {
        label: "Je vis seul·e",
        value: false,
      },
      {
        label: "Je vis en couple",
        value: true,
      },
    ],
    question: "Vivez-vous seul·e ou en couple ?",
    questionType: "enum",
  }),

  parisien: new BooleanProperty({
    question: ({ simulation }) => {
      return `Avez-vous habité Paris au moins 3 ans depuis ${yearsAgo(
        5,
        simulation.dateDeValeur
      )} ?`
    },
  }),

  proprietaire_proche_famille: new BooleanProperty({
    question: `Avez-vous un lien de parenté direct avec votre propriétaire ?
      <span class="help"
        >Est-il un ascendant ou descendant de vous ou votre conjoint·e (enfant,
        grand-parent…) ?</span
      >`,
  }),

  rsa_isolement_recent: new BooleanProperty({
    question: "Vivez-vous seul·e depuis plus de 18 mois ?",
  }),
}
