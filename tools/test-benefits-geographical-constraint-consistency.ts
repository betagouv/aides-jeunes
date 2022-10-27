import benefits from "../data/all"

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
      console.log(`
      ================================
      Benefit : ${benefit.id}
      Insee code : ${benefit.institution.code_insee}
      potentially incompatible with conditions :
      ${JSON.stringify(result?.conditions)}`)
    }
  })

function testGeographicalRelevancy(benefit) {
  const conditionGeo = benefit.conditions_generales.find((condition) => {
    return (
      condition.type === "regions" ||
      condition.type === "departements" ||
      condition.type === "communes" ||
      condition.type === "epcis" ||
      condition.type === "attached_to_institution"
    )
  })
  if (conditionGeo) {
    return {
      isValid:
        conditionGeo.type === "attached_to_institution" ||
        (conditionGeo.values.length == 1 &&
          conditionGeo.values[0] === benefit.institution.code_insee &&
          conditionGeo.type.slice(0, -1) === benefit.institution.type),
      conditions: conditionGeo,
    }
  }
}

export default testGeographicalRelevancy
