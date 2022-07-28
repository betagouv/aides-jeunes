import benefits from "../dist-server/data/all.js"

benefits.all
  .filter((benefit) => {
    return (
      ["region", "departement", "commune", "epci"].includes(
        benefit.institution.type
      ) && benefit.source === "javascript"
    )
  })
  .forEach((benefit) => {
    const result = testGeographicalRelevancy(benefit)
    if (!result?.isValid) {
      console.log("================================")
      console.log(`Benefit : ${benefit.id}`)
      console.log(`Insee code : ${benefit.institution.code_insee}`)
      console.log("potentially incompatible with conditions :")
      console.log(result?.conditions)
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
      isValid:
        conditionGeo.values.length == 1 &&
        conditionGeo.values[0] === benefit.institution.code_insee &&
        conditionGeo.type.slice(0, -1) === benefit.institution.type,
      conditions: conditionGeo,
    }
  }
}

export default testGeographicalRelevancy
