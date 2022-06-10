import Famille from "./properties/famille-properties"
import Individu from "./properties/individu-properties"
import Menage from "./properties/menage-properties"
import Parents from "./properties/parents-properties"
import { Property } from "./properties/property"

export const ENTITIES_PROPERTIES = {
  famille: Famille,
  individu: Individu,
  menage: Menage,
  parents: Parents,
}

export function forEachProperties(
  fn: (entityName: string, propertyName: string, property: Property) => {}
) {
  Object.entries(ENTITIES_PROPERTIES).forEach(
    ([entityName, entityProperties]) => {
      Object.entries(entityProperties).forEach(([propertyName, property]) => {
        fn(entityName, propertyName, property)
      })
    }
  )
}
