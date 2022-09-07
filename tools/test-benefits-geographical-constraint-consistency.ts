import benefits from "../data/all.js"

benefits.all
  .filter((benefit) => {
    return (
      ["region", "departement", "commune", "epci"].includes(
        benefit.institution.type
      ) && benefit.source === "javascript"
    )
  })
  .forEach((benefit) => {
    const { conditionFound, isValid, conditions } =
      testGeographicalRelevancy(benefit)
    if (conditionFound && !isValid) {
      console.log("================================")
      console.log(`Benefit : ${benefit.id}`)
      console.log(`Insee code : ${benefit.institution.code_insee}`)
      console.log("potentially incompatible with conditions :", conditions)
    }
  })

function testGeographicalRelevancy(benefit) {
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
      conditionFound: true,
      isValid:
        conditionGeo.values.length == 1 &&
        conditionGeo.values[0] === benefit.institution.code_insee &&
        conditionGeo.type.slice(0, -1) === benefit.institution.type,
      conditions: conditionGeo,
    }
  }
  return { conditionFound: false, isValid: false, conditions: null }
}

export default testGeographicalRelevancy
