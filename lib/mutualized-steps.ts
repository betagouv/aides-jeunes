const ENTITIES_PROPERTIES: { [key: string]: any } = {
  famille: require("./properties/famille-properties"),
  individu: require("./properties/individu-properties"),
  menage: require("./properties/menage-properties"),
  parents: require("./properties/parents-properties"),
}

function forEachProperties(
  fn: (entityName: string, propertyName: string, property: any) => any
) {
  Object.entries(ENTITIES_PROPERTIES).forEach(
    ([entityName, entityProperties]) => {
      Object.entries(entityProperties).forEach(([propertyName, property]) => {
        fn(entityName, propertyName, property)
      })
    }
  )
}

module.exports = {
  ENTITIES_PROPERTIES,
  forEachProperties,
}
