const regions = require("@etalab/decoupage-administratif/data/regions.json")
const departements = require("@etalab/decoupage-administratif/data/departements.json")

const { institutionsMap } = require("../data/all")

const institutionIds = Object.keys(institutionsMap)

institutionIds.forEach((id) => {
  const institution = institutionsMap[id]
  const typeInstitution = institution.type
  if (typeInstitution == "region" || typeInstitution == "departement") {
    if (!geoRelevancy(institution)) {
      console.log(institution.slug)
    } else {
      console.log("Y'a pas de bug")
    }
  }
})

function geoRelevancy(institution) {
  if (institution.type == "region") {
    const relevantRegion = regions.find((region) => {
      return region.code === institution.code_insee
    })
    return Boolean(relevantRegion)
  } else if (institution.type == "departement") {
    const relevantDepartement = departements.find((departement) => {
      return departement.code === institution.code_insee
    })
    return Boolean(relevantDepartement)
  }
}

console.log(geoRelevancy({ code_insee: "04", type: "region" }))
console.log(geoRelevancy({ code_insee: "973", type: "region" }))
console.log(geoRelevancy({ code_insee: "101", type: "departement" }))
console.log(geoRelevancy({ code_insee: "973", type: "departement" }))
