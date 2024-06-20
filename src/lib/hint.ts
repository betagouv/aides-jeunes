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
  service_civique: (): string => {
    return `Un Service Civique est un engagement volontaire au service de l'intérêt général. Depuis le 1er juillet 2022, le Service Civique est indemnisé 601 euros net par mois environ. 
    Pour plus d'informations, vous pouvez consulter le site officiel du <a href="https://www.service-civique.gouv.fr/comprendre-le-service-civique" target="_blank">Service Civique</a>.
    <br/><br/>
    Vous pouvez trouver des missions sur <a href="https://www.1jeune1solution.gouv.fr/service-civique" target="_blank">la page dédié du site 1jeune1solution.gouv.fr</a>.
    `
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
