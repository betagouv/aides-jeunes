import { forEachProperties } from "@lib/mutualized-steps.js"

const texts = {
  depcom: (): string => {
    return "Le simulateur n'accepte que les codes postaux français. Si vous vivez à l'étranger, ce simulateur n'est pas encore adapté à votre situation."
  },
  enfants: (): string => {
    return `« Un enfant à charge » est un enfant dont vous êtes responsable et dont vous vous occupez, qu'il soit votre enfant naturel ou non.`
  },
}

// Retrieve `moreInfo` field of each mutualized step
forEachProperties((_, propertyName, property) => {
  if (property.moreInfo) {
    texts[propertyName] = property.moreInfo
  }
})

const Hint = {
  get(attribute: string, variation: string): string {
    return typeof texts[attribute] === "string"
      ? texts[attribute]
      : texts[attribute]?.(variation)
  },
}

export default Hint
