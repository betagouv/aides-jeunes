import Famille from "./properties/famille-properties.js"
import Individu from "./properties/individu-properties.js"
import Menage from "./properties/menage-properties.js"
import Parents from "./properties/parents-properties.js"
import { Property } from "./properties/property.js"
import DepcomProperties from "./properties/depcom-properties.js"
import SimpleProperties from "./properties/others/simple-properties.js"
import { Step } from "./types/property.js"

export const ENTITIES_PROPERTIES: {
  [key: string]: { [key: string]: Property }
} = {
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

export function getPropertyOfStep(step: Step): Property {
  return (
    ENTITIES_PROPERTIES[step.entity]?.[step.variable] ||
    DepcomProperties[step.variable] ||
    SimpleProperties[step.variable]
  )
}
