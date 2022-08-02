import Famille from "./properties/famille-properties.js"
import Individu from "./properties/individu-properties.js"
import Menage from "./properties/menage-properties.js"
import Parents from "./properties/parents-properties.js"
import { Property } from "./properties/property.js"

export const ENTITIES_PROPERTIES = {
  famille: Famille,
  individu: Individu,
  menage: Menage,
  parents: Parents,
}

export function forEachProperties(
  fn: (entityName: string, propertyName: string, property: Property) => void
) {
  Object.entries(ENTITIES_PROPERTIES).forEach(
    ([entityName, entityProperties]) => {
      Object.entries(entityProperties).forEach(([propertyName, property]) => {
        fn(entityName, propertyName, property)
      })
    }
  )
}
