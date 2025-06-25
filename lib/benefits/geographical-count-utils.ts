import epcis from "@etalab/decoupage-administratif/data/epci.json" with { type: "json" }

import institutionsMap from "../../data/all.js"

export function isGeographicallyIncluded(
  commune,
  institution,
  epciInfoParams?: any
) {
  const typeInstitution = institution.type
  const idInstitution = institution.code_insee || institution.code_siren

  if (typeInstitution == "national") {
    return true
  } else if (typeInstitution == "region") {
    const codeNiveauInstitution = commune[typeInstitution]
    return idInstitution == codeNiveauInstitution
  } else if (typeInstitution == "departement") {
    const codeNiveauInstitution = commune[typeInstitution]
    return idInstitution == codeNiveauInstitution
  } else if (typeInstitution == "epci") {
    const epciInfo =
      epciInfoParams || epcis.find((element) => element.code === idInstitution)
    if (epciInfo === undefined) {
      return false
    }
    return Boolean(epciInfo.membres.find((c) => c.code === commune.code))
  } else if (typeInstitution == "commune") {
    return idInstitution == commune.code
  } else {
    return false
  }
}

const institutionIds = Object.keys(institutionsMap)

export function computeInterestingBenefitCounts(commune) {
  const totals = {}
  institutionIds.forEach((id) => {
    const institution = institutionsMap[id]
    const result = isGeographicallyIncluded(commune, institution)
    if (result) {
      const previousValue = totals[institution.type] || 0
      totals[institution.type] = previousValue + institution.benefitsIds.length
    }
  })
  return totals
}
