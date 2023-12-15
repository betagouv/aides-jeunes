import { forEachProperties } from "@lib/mutualized-steps.js"

const texts = {
  depcom: (): string => {
    return "Le simulateur n'accepte que les codes postaux français. Si vous vivez à l'étranger, ce simulateur n'est pas encore adapté à votre situation."
  },
  _bourseCriteresSociauxCommuneDomicileFamilial: (): string => {
    return "Lorsque vos parents sont séparés, il faut indiquer le code postal du parent qui vous a à charge. Si vous êtes encore mineur et en garde alternée, il faut indiquer le code postal du parent dont le domicile est le plus proche du votre."
  },
  enfants: (): string => {
    return `« Un enfant à charge » est un enfant dont vous êtes responsable et dont vous vous occupez, qu'il soit votre enfant naturel ou non.`
  },
  types: (): string => {
    // Step: resources/types
    return `Lorsque vos parents sont séparés, il faut indiquer les types de ressources perçues par le parent qui vous a à charge. Si vous êtes mineur et en garde alternée, il faut indiquer les types de ressources perçues par les deux foyers fiscaux des parents séparés.`
  },
}

// Retrieve `moreInfo` field of each mutualized step
forEachProperties((_, propertyName, property) => {
  if (property.moreInfo) {
    texts[propertyName] = property.moreInfo
  }
})

const Hint = {
  get(attribute: string, variation?: string): string {
    return typeof texts[attribute] === "string"
      ? texts[attribute]
      : texts[attribute]?.(variation)
  },
}

export default Hint
