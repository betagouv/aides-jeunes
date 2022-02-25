const fs = require("fs")
const ProgressBar = require("progress")
const communesBase = require("@etalab/decoupage-administratif/data/communes.json")
const epcis = require("@etalab/decoupage-administratif/data/epci.json")

const { institutionsMap } = require("../data/all")
const {
  isGeographicallyIncluded,
} = require("../lib/benefits/geographical-count-utils")

const communes = communesBase.filter(
  (commune) => commune.type === "commune-actuelle"
)

const communeMap = {}
communes.forEach((commune) => {
  communeMap[commune.code] = commune
  commune.count = 0
  commune.institutions = []
  commune.benefits = []
})

const institutionIds = Object.keys(institutionsMap)

function listInterestingInstitutions(commune, institution) {
  commune.institutions.push(institution.id)
}

function incrementCount(commune, institution) {
  commune.count += institution.benefitsIds.length
}

function listInterestingBenefits(commune, institution) {
  const benefits = institution.benefitsIds
  benefits.forEach((benefit) => {
    commune.benefits.push(benefit)
  })
}

function iterateGivenGeographicalRelevancy(apply) {
  const bar = new ProgressBar(":bar :elapsed :eta", {
    total: institutionIds.length,
  })

  institutionIds.forEach((id) => {
    const institution = institutionsMap[id]
    switch (institution.type) {
      case "national":
        communes.forEach((commune) => {
          apply(communeMap[commune.code], institution)
        })
        break
      case "region":
      case "departement":
        communes.forEach((commune) => {
          const included = isGeographicallyIncluded(commune, institution)
          if (included) {
            apply(communeMap[commune.code], institution)
          }
        })
        break
      case "epci": {
        const epciInfo = epcis.find(
          (element) => element.code === institution.code_siren
        )
        if (!epciInfo) {
          console.log(institution.slug)
          // process.exit(1)
          break
        }
        epciInfo.membres.forEach((commune) => {
          apply(communeMap[commune.code], institution)
        })
        break
      }
      case "commune": {
        if (!communeMap[institution.id]) {
          // console.log(institution.id)
          break
        }
        apply(communeMap[institution.id], institution)
        break
      }
      case "caf":
        communes.forEach((commune) => {
          const included = isGeographicallyIncluded(commune, institution)
          if (included) {
            apply(communeMap[commune.code], institution)
          }
        })
        break
      default:
        console.log("Dont know how to deal with " + institution.type)
    }

    bar.tick()
  })
}

iterateGivenGeographicalRelevancy(listInterestingInstitutions)
iterateGivenGeographicalRelevancy(incrementCount)
iterateGivenGeographicalRelevancy(listInterestingBenefits)

fs.writeFileSync(
  "geographical-benefits-details.json",
  JSON.stringify(communeMap, null, 2)
)
