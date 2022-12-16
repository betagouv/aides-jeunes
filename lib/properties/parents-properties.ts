import { EnumProperty, NumberProperty, BooleanProperty } from "./property"

export default {
  _situation: new EnumProperty({
    question: "Quelle est la situation de vos parents ?",
    questionType: "enum",
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
  }),
  _en_france: new BooleanProperty({
    question: "Vos parents habitent-ils en France ?",
  }),

  nbptr: new NumberProperty({
    question:
      "Quel est le nombre de parts sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    optional: true,
    type: "count",
    min: 0,
    max: 30,
    moreInfo:
      "Une part fiscale est une unité représentative des personnes composant le foyer fiscal, servant au calcul de l’impôt sur le revenu.",
  }),

  rfr: new NumberProperty({
    question:
      "Quel est le revenu fiscal de référence (RFR) sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
  }),
}
