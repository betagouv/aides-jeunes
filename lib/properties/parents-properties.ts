import { EnumProperty, NumberProperty, BooleanProperty } from "./property.js"

export default {
  _en_france: new BooleanProperty({
    question: "Vos parents habitent-ils en France ?",
  }),
  _situation: new EnumProperty({
    items: [
      {
        label: "En couple",
        value: "en_couple",
      },
      {
        label: "Séparés",
        value: "separes",
      },
      {
        label: "Célibataire",
        value: "celibataire",
      },
      {
        label: "Veuf ou veuve",
        value: "veuve",
      },
      {
        label: "Décédés",
        value: "decedes",
      },
      {
        label: "Sans autorité parentale",
        value: "sans_autorite",
      },
    ],
    question: "Quelle est la situation de vos parents ?",
    questionType: "enum",
  }),

  nbptr: new NumberProperty({
    moreInfo:
      "Une part fiscale est une unité représentative des personnes composant le foyer fiscal, servant au calcul de l’impôt sur le revenu.",
    optional: true,
    question:
      "Quel est le nombre de parts sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    type: "count",
  }),

  rfr: new NumberProperty({
    question:
      "Quel est le revenu fiscal de référence (RFR) sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
  }),
}
