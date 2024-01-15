import { EnumProperty, NumberProperty, BooleanProperty } from "./property.js"
import { yearsAgo } from "../utils.js"

export default {
  bourse_criteres_sociaux_nombre_enfants_a_charge: new NumberProperty({
    question:
      "Combien d'enfants (vous y compris) sont à la charge de vos parents ?",
    moreInfo:
      "Lorsque vos parents sont séparés, il faut indiquer le nombre d'enfants à la charge du parent qui vous a à charge. Si vous êtes encore mineur et en garde alternée, il faut faire la somme des enfants à la charge des deux foyers fiscaux des parents séparés.",
    questionType: "number",
    min: 1,
    type: "count",
  }),

  bourse_criteres_sociaux_nombre_enfants_a_charge_dans_enseignement_superieur:
    new NumberProperty({
      question: "Et combien (vous y compris) font des études supérieures ?",
      questionType: "number",
      min: 0,
      type: "count",
    }),

  bourse_lycee: new BooleanProperty({
    question: "Actuellement bénéficiez-vous d'une bourse du lycée ?",
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
    question: `Avez-vous un lien de parenté direct avec votre propriétaire ?
      <span class="fr-hint-text"
        >Est-il un ascendant ou descendant de vous ou votre conjoint ou conjointe (enfant,
        grand-parent…) ?</span
      >`,
  }),

  rsa_isolement_recent: new EnumProperty({
    question: ({ simulation }) => {
      return `Vivez-vous seul ou seule avec ${
        simulation.enfants.length == 1 ? "votre enfant" : "vos enfants"
      } depuis plus de 18 mois ?`
    },
    items: [
      {
        value: false,
        label: "Oui",
      },
      {
        value: true,
        label: "Non",
      },
    ],
  }),

  en_couple: new BooleanProperty({
    question: "Vivez-vous en couple ?",
  }),
}
