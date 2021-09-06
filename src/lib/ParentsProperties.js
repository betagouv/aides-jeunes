const loadEntity = (component) => {
  const parents = {
    ...(component.$store.getters.getParents || {}),
  }
  return parents
}

const STEPS = {
  _situation: {
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
  },
  _en_france: {
    question: "Vos parents habitent-ils en France ?",
  },
  nbptr: {
    question:
      "Quel est le nombre de parts sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    optional: true,
  },
  rfr: {
    question:
      "Quel est le revenu fiscal de référence (RFR) sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    wrapperClassName: "aj-input-currency-wrapper",
  },
}

export default {
  loadEntity,
  STEPS,
}
