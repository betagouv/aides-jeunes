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
    return `Un <b>Service Civique</b> est un engagement volontaire au service de l'intérêt général. Depuis le 1er juillet 2022, le Service Civique est indemnisé 601 euros net par mois environ. 
    Une <b>vidéo de présentation</b> du Service Civique en 1 minute est disponible <a href="https://www.youtube.com/watch?v=iEm8Q6Esqd0" target="_blank">sur Youtube</a>.
    <br/><br/>
    Pour plus d'informations, vous pouvez consulter <a href="https://www.service-civique.gouv.fr/comprendre-le-service-civique" target="_blank">le site officiel du Service Civique</a>.
    <br/><br/>
    Des missions sont disponibles sur la page dédiée de <a href="https://www.1jeune1solution.gouv.fr/service-civique" target="_blank">1jeune1solution.gouv.fr</a>.
    `
  },
  loyer: (): string => {
    return `
    <h5>Que sont les charges locatives ?</h5>
    Les charges locatives (ou charges récupérables) sont des dépenses dues par le locataire, mais initialement payées par le propriétaire (ou son réprésentant). Le propriétaire (ou son représentant) 
    se fait rembourser ces dépenses par le locataire. Le mode de paiement de ces charges est différent, selon qu'il s'agit d'un bail d'habitation vide ou meublé.</br/><br/>
    Plus d'informations sur le site du service public : <a href="https://www.service-public.fr/particuliers/vosdroits/F947" target="_blank">https://www.service-public.fr/particuliers/vosdroits/F947</a>
    </br/><br/>
    <h5>Où trouver le montant des charges locatives ?</h5>
    Les informations sur les charges locatives peuvent être trouvées dans plusieurs documents différents : sur votre bail de location, sur l'état des lieux ou sur le décompte annuel des charges.`
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
