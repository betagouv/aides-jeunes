const ENTITIES_PROPERTIES = {
  famille: require("./properties/famille-properties"),
  individu: require("./properties/individu-properties"),
  menage: require("./properties/menage-properties"),
  parents: require("./properties/parents-properties"),
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
