import epcis from "@etalab/decoupage-administratif/data/epci.json" assert { type: "json" }

import institutionsMap from "../../data/all.js"

export function isGeographicallyIncluded(
  commune,
  institution,
  epciInfoParams?: any
) {
  const typeInstitution = institution.type
  const idInstitution = institution.code_insee || institution.code_siren

  if (typeInstitution == "Organisation nationale") {
    return true
  } else if (typeInstitution == "Région") {
    const codeNiveauInstitution = commune.region
    return idInstitution == codeNiveauInstitution
  } else if (typeInstitution == "Département") {
    const codeNiveauInstitution = commune.departement
    return idInstitution == codeNiveauInstitution
  } else if (typeInstitution == "EPCI (Métropole, inter-communauté, etc.)") {
    const epciInfo =
      epciInfoParams || epcis.find((element) => element.code === idInstitution)
    if (epciInfo === undefined) {
      return false
    }
    return Boolean(epciInfo.membres.find((c) => c.code === commune.code))
  } else if (typeInstitution == "Commune") {
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
