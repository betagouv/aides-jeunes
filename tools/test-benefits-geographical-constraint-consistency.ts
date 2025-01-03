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
    if (
      conditionGeo.type === "attached_to_institution" ||
      conditionGeo.values.length > 1
    ) {
      return {
        isValid: true,
        conditions: conditionGeo,
      }
    }

    const isValid = conditionGeo.values.every((value) => {
      const isValid =
        value === benefit.institution.code_insee &&
        conditionGeo.type.slice(0, -1) === benefit.institution.type
      if (!isValid) {
        console.error(`
          ================================
          Benefit : ${benefit.id}
          Benefit slug : ${benefit.slug}
          Expected Insee code : ${benefit.institution.code_insee}
          Condition type : ${conditionGeo.type}
          Benefit institution type : ${benefit.institution.type}`)
      }
      return isValid
    })

    return {
      isValid,
      conditions: conditionGeo,
    }
  }
}

export default testGeographicalRelevancy
