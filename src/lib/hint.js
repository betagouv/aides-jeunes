import { ENTITIES_PROPERTIES } from "@/lib/mutualized-steps"

const texts = {
  depcom: () => {
    return "Le simulateur n'accepte que les codes postaux français. Si vous vivez à l'étranger, ce simulateur n'est pas encore adapté à votre situation."
  },
  enfants: () => {
    return `« Un enfant à charge » est un enfant dont vous êtes responsable et dont vous vous occupez, qu'il soit votre enfant naturel ou non.`
  },
}

// Retrieve `moreInfo` field of each mutualized step
Object.values(ENTITIES_PROPERTIES).forEach((property) => {
  Object.entries(property.STEPS).forEach(([stepName, step]) => {
    if (step.moreInfo) {
      texts[stepName] = step.moreInfo
    }
  })
})

const Hint = {
  get(attribute, variation) {
    return typeof texts[attribute] === "string"
      ? texts[attribute]
      : texts[attribute]?.(variation)
  },
}

export default Hint
