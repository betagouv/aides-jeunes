const AJ_NOT_RELIABLE =
  "Attention, les calculs du simulateur sont peu fiables pour les communes de"

const texts = {
  aj_not_reliable(variation) {
    if (variation) {
      if (variation.startsWith("976")) {
        return `${AJ_NOT_RELIABLE} Mayotte.`
      }
      if (variation.startsWith("987")) {
        return `${AJ_NOT_RELIABLE} Polynésie Française.`
      }
      if (variation.startsWith("988")) {
        return `${AJ_NOT_RELIABLE} Nouvelle-Calédonie.`
      }
    }
  },
}

const Warning = {
  get(attribute, variation) {
    return texts[attribute] && texts[attribute](variation)
  },
}

export default Warning
