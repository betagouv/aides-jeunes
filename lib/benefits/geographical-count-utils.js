/* eslint-disable no-unreachable */
const communes = require("@etalab/decoupage-administratif/data/communes.json")
const epcis = require("@etalab/decoupage-administratif/data/epci.json")
const departements = require("@etalab/decoupage-administratif/data/departements.json")

var { institutionsMap } = require("../../data/all")

function isGeographicallyIncluded(commune, institution, epciInfoParams) {
  // Trouve dans la liste "communes" l'élément où la valeur de la clé code vaut codeInsee
  // return false

  const typeInstitution = institution.type
  const idInstitution = institution.id
  // const codeRegion = communeInfo.region
  // const codeDepartement = communeInfo.departement
  // Compare l'Id de l'institution avec le code région/departement/epci/caf/commune
  if (typeInstitution == "national") {
    return true
  } else if (typeInstitution == "region") {
    const codeNiveauInstitution = commune[typeInstitution]
    return idInstitution == codeNiveauInstitution
  } else if (typeInstitution == "departement") {
    const codeNiveauInstitution = commune[typeInstitution]
    return idInstitution == codeNiveauInstitution
  } else if (typeInstitution == "epci") {
    // Trouve dans la liste "epcis" l'élément où la propriété membres trouve elle-même l'élément
    // où la propriété code vaut codeInsee
    const epciInfo =
      epciInfoParams || epcis.find((element) => element.code === idInstitution)
    // Si ne trouve pas d'epci --> renvoie false
    if (epciInfo === undefined) {
      return false
    }
    return epciInfo.membres.find((c) => c.code === commune.code)
  } else if (typeInstitution == "commune") {
    return idInstitution == commune.code
  } else if (typeInstitution == "caf") {
    return false
    const communeInfo = communes.find(
      (element) => element.code === commune.code
    )
    const codeDepartement = communeInfo.departement
    const departementInfo = departements.find(
      (departement) => departement.code === codeDepartement
    )
    const nomDepartement = departementInfo.nom
    const regExDepartement = nomDepartement
      .toLowerCase()
      .replace("d'", "")
      .replace(" ", "-")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
    const regExCaf = idInstitution.substring(4).replace("_", "-")
    return regExCaf == regExDepartement
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
