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
    // Trouve dans la liste "epcis" l'élément où la valeur de la clé membres trouve elle-même l'élément
    // où la valeur de la clé code vaut codeInsee
    const epciInfo = epcis.find((element) =>
      element.membres.find((commune) => commune.code === codeInsee)
    )
    const codeEpci = epciInfo.code
    return idInstitution == codeEpci
  } else if (typeInstitution == "commune") {
    return idInstitution == codeInsee
  } else {
    return false
  }
}

module.exports = {
  isGeographicallyIncluded,
}
