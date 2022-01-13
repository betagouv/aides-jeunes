const communes = require("@etalab/decoupage-administratif/data/communes.json")

const epcis = require("@etalab/decoupage-administratif/data/epci.json")

function isGeographicallyIncluded(codeInsee, institution) {
  // Trouve dans la liste "communes" l'élément où la valeur de la clé code vaut codeInsee
  const communeInfo = communes.find((element) => element.code === codeInsee)

  const typeInstitution = institution.type
  const idInstitution = institution.id
  const codeRegion = communeInfo.region // On récupère le code région dans laquelle la commune se trouve
  const codeDepartement = communeInfo.departement

  // Compare l'Id de l'institution avec le code région/departement/epci/commune
  if (typeInstitution == "national") {
    return true
  } else if (typeInstitution == "region") {
    return idInstitution == codeRegion
  } else if (typeInstitution == "departement") {
    return idInstitution == codeDepartement
  } else if (typeInstitution == "epci") {
    // Trouve dans la liste "epcis" l'élément où la propriété membres trouve elle-même l'élément
    // où la propriété code vaut codeInsee
    const epciInfo = epcis.find((element) =>
      element.membres.find((commune) => commune.code === codeInsee)
    )
    // Si ne trouve pas d'epci --> renvoie false
    if (epciInfo === undefined) {
      return false
    }
    const codeEpci = epciInfo.code
    return idInstitution == codeEpci
  } else if (typeInstitution == "commune") {
    return idInstitution == codeInsee
  } else {
    return false
  }
}

function computeInterestingBenefitsCount(codeInsee) {
  let total = 0
  institutionIds.forEach((id) => {
    const institution = institutionsMap[id]
    const result = isGeographicallyIncluded(codeInsee, institution)
    if (result) {
      total = total + institution.benefitsIds.length
    }
  })
  return total
}

module.exports = {
  isGeographicallyIncluded,
  computeInterestingBenefitsCount,
}
