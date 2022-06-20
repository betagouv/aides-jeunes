const benefits = require("../data/all")

benefits.all
  .filter((benefit) => {
    return (
      ["region", "departement", "commune", "epci"].includes(
        benefit.institution.type
      ) && benefit.source === "javascript"
    )
  })
  .forEach((benefit) => {
    const result = testGeoRelevancy(benefit)
    if (!result.isValid) {
      console.log(benefit.id)
      console.log(benefit.institution.code_insee)
      console.log(result.conditions)
    }
  })

function testGeoRelevancy(benefit) {
  const conditionGeo = benefit.conditions_generales.find((condition) => {
    return (
      condition.type === "regions" ||
      condition.type === "departements" ||
      condition.type === "communes" ||
      condition.type === "epcis"
    )
  })
  if (conditionGeo) {
    return {
      isValid:
        conditionGeo.values.length == 1 &&
        conditionGeo.values[0] === benefit.institution.code_insee &&
        conditionGeo.type.slice(0, -1) === benefit.institution.type,
      conditions: conditionGeo,
    }
  }
}
