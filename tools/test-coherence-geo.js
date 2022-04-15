const regions = require("@etalab/decoupage-administratif/data/regions.json")
const departements = require("@etalab/decoupage-administratif/data/departements.json")
const communes = require("@etalab/decoupage-administratif/data/communes.json")
const epcis = require("@etalab/decoupage-administratif/data/epci.json")

const { institutionsMap } = require("../data/all")

const codesRegion = []
const codesDepartement = []
const codesCommune = []
const codesEpci = []

regions.forEach((region) => {
  codesRegion.push(region.code)
})
departements.forEach((departement) => {
  codesDepartement.push(departement.code)
})
communes.forEach((commune) => {
  codesCommune.push(commune.code)
})
epcis.forEach((epci) => {
  codesEpci.push(epci.code)
})

const codesInstitution = {
  regions: codesRegion,
  departements: codesDepartement,
  communes: codesCommune,
  epcis: codesEpci,
}

console.log(codesInstitution)

const complexInstitution = ["collectivité-européenne-dalsace"]

const institutionIds = Object.keys(institutionsMap)

institutionIds.forEach((id) => {
  const institution = institutionsMap[id]
  const typeInstitution = institution.type
  if (
    typeInstitution == "region" ||
    typeInstitution == "departement" ||
    typeInstitution == "commune" ||
    typeInstitution == "epci"
  ) {
    if (!complexInstitution.includes(institution.slug)) {
      if (!geoRelevancy(institution)) {
        console.log(institution.slug)
      } else {
        console.log("Y'a pas de bug")
      }
    }
  }
})

function geoRelevancy(institution) {
  if (institution.type == "region") {
    const relevantRegion = codesInstitution.regions.includes(
      institution.code_insee
    )
    return relevantRegion
  } else if (institution.type == "departement") {
    const relevantDepartement = codesInstitution.departements.includes(
      institution.code_insee
    )
    return relevantDepartement
  } else if (institution.type == "commune") {
    const relevantCommune = codesInstitution.communes.includes(
      institution.code_insee
    )
    return relevantCommune
  } else if (institution.type == "epci") {
    const relevantEpci = codesInstitution.epcis.includes(institution.code_siren)
    return relevantEpci
  }
}

console.log(geoRelevancy({ code_insee: "04", type: "region" }))
console.log(geoRelevancy({ code_insee: "973", type: "region" }))
console.log(geoRelevancy({ code_insee: "101", type: "departement" }))
console.log(geoRelevancy({ code_insee: "973", type: "departement" }))
console.log(geoRelevancy({ code_insee: "44444", type: "commune" }))
console.log(geoRelevancy({ code_insee: "33009", type: "commune" }))
console.log(geoRelevancy({ code_siren: "44444", type: "epci" }))
console.log(geoRelevancy({ code_siren: "200000172", type: "epci" }))
