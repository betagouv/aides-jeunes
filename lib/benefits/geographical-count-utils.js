const epcis = require("@etalab/decoupage-administratif/data/epci.json")
const departements = require("@etalab/decoupage-administratif/data/departements.json")

var { institutionsMap } = require("../../data/all")

function isGeographicallyIncluded(commune, institution, epciInfoParams) {
  const typeInstitution = institution.type
  const idInstitution = institution.id

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
    return epciInfo.membres.find((c) => c.code === commune.code)
  } else if (typeInstitution == "commune") {
    return idInstitution == commune.code
  } else if (typeInstitution == "caf") {
    const departementInfo = departements.find(
      (departement) =>
        departement.nom
          .toLowerCase()
          .replace("d'", "")
          .replace(" ", "-")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "") ===
        idInstitution.substring(4).replace("_", "-")
    )
    const codeDepartement = departementInfo.code
    return commune.departement == codeDepartement
  } else {
    return false
  }
}

const institutionIds = Object.keys(institutionsMap)

function computeInterestingBenefitCounts(commune) {
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

module.exports = {
  isGeographicallyIncluded,
  computeInterestingBenefitCounts,
}
