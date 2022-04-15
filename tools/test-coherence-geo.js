const regions = require("@etalab/decoupage-administratif/data/regions.json")
const departements = require("@etalab/decoupage-administratif/data/departements.json")
const communes = require("@etalab/decoupage-administratif/data/communes.json")

const { institutionsMap } = require("../data/all")

const codesRegion = []
const codesDepartement = []
const codesCommune = []

regions.forEach((region) => {
  codesRegion.push(region.code)
})
departements.forEach((departement) => {
  codesDepartement.push(departement.code)
})
communes.forEach((commune) => {
  codesCommune.push(commune.code)
})

const codesInsee = {
  regions: codesRegion,
  departements: codesDepartement,
  communes: codesCommune,
}

console.log(codesInsee)

const complexInstitution = ["collectivité-européenne-dalsace"]

const institutionIds = Object.keys(institutionsMap)

institutionIds.forEach((id) => {
  const institution = institutionsMap[id]
  const typeInstitution = institution.type
  if (
    typeInstitution == "region" ||
    typeInstitution == "departement" ||
    typeInstitution == "commune"
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
  if (!complexInstitution.includes(institution.slug)) {
    if (institution.type == "region") {
      const relevantRegion = codesInsee.regions.includes(institution.code_insee)
      return relevantRegion
    } else if (institution.type == "departement") {
      const relevantDepartement = codesInsee.departements.includes(
        institution.code_insee
      )
      return relevantDepartement
    } else if (institution.type == "commune") {
      const relevantCommune = codesInsee.communes.includes(
        institution.code_insee
      )
      return relevantCommune
    }
  }
}

console.log(geoRelevancy({ code_insee: "04", type: "region" }))
console.log(geoRelevancy({ code_insee: "973", type: "region" }))
console.log(geoRelevancy({ code_insee: "101", type: "departement" }))
console.log(geoRelevancy({ code_insee: "973", type: "departement" }))
console.log(geoRelevancy({ code_insee: "44444", type: "commune" }))
console.log(geoRelevancy({ code_insee: "33009", type: "commune" }))
