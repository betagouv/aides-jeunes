const ENTITIES_PROPERTIES = {
  famille: require("./properties/famille-properties.ts"),
  individu: require("./properties/individu-properties.ts"),
  menage: require("./properties/menage-properties.ts"),
  parents: require("./properties/parents-properties.ts"),
}

function forEachProperties(fn) {
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
