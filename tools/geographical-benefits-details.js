/* eslint-disable prettier-vue/prettier */
const fs = require("fs")
const ProgressBar = require("progress")
const communes = require("@etalab/decoupage-administratif/data/communes.json")
const epcis = require("@etalab/decoupage-administratif/data/epci.json")

const { institutionsMap } = require("../data/all")
const {
  isGeographicallyIncluded,
  computeInterestingBenefitCounts,
} = require("../lib/benefits/geographical-count-utils")

const communeMap = {}
communes.forEach((commune) => {
  communeMap[commune.code] = commune
})

const institutionIds = Object.keys(institutionsMap)
const bar = new ProgressBar(":bar :elapsed :eta", {
  total: institutionIds.length,
})

institutionIds.forEach((id) => {
  const institution = institutionsMap[id]
  switch (institution.type) {
    case "national":
      communes.forEach((commune) => {
        const previousValue = communeMap[commune.code].count || 0
        communeMap[commune.code].count =
          previousValue + institution.benefitsIds.length
      })
      break
    case "region":
    case "departement":
      communes.forEach((commune) => {
        const included = isGeographicallyIncluded(commune, institution)
        const previousValue = communeMap[commune.code].count || 0
        communeMap[commune.code].count =
          previousValue + (included ? institution.benefitsIds.length : 0)
      })
      break
    case "epci":
      const epciInfo = epcis.find((element) => element.code === institution.id)
      if (!epciInfo) {
        console.log(institution)
        process.exit(1)
      }
      epciInfo.membres.forEach((commune) => {
        const previousValue = communeMap[commune.code].count || 0
        communeMap[commune.code].count =
          previousValue + institution.benefitsIds.length
      })
      break
    case "commune":
      if (!communeMap[institution.id]) {
        console.log(institution.id)
        break
      }
      const previousValue = communeMap[institution.id].count || 0
      communeMap[institution.id].count =
        previousValue + institution.benefitsIds.length
      break
    case "caf":
      break
    default:
      console.log("Dont know how to deal with " + typeInstitution)
  }

  bar.tick()
})

fs.writeFileSync(
  "geographical-benefits-details.json",
  JSON.stringify(communeMap, null, 2)
)
