import Famille from "./properties/famille-properties"
import Individu from "./properties/individu-properties"
import Menage from "./properties/menage-properties"
import Parents from "./properties/parents-properties"
import { Property } from "./properties/property"
import DepcomProperties from "./properties/depcom-properties"
import SimpleProperties from "./properties/others/simple-properties"
import { Step } from "./types/property"

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
