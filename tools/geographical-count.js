const communes = require("@etalab/decoupage-administratif/data/communes.json")
const {
  computeInterestingBenefitCounts,
} = require("../lib/benefits/geographical-count-utils")

const codeInsee = process.argv[process.argv.length - 1]
const communeInfo = communes.find((c) => c.code === codeInsee)

if (!communeInfo) {
  console.error("Ce code INSEE ne correspond à aucune commune.")
  process.exit(1)
}
const interestingBenefitCounts = computeInterestingBenefitCounts(codeInsee)

const counts = Object.values(interestingBenefitCounts)
let total = counts.reduce((accumulator, value) => {
  return accumulator + value
}, 0)

console.log(
  `Il y a ${total} aides pertinentes pour ${communeInfo.nom} (${codeInsee}).`
)

const institutionTypes = Object.keys(interestingBenefitCounts)
institutionTypes.forEach((institutionType) => {
  console.log(
    `  - ${institutionType}: ${interestingBenefitCounts[institutionType]}`
  )
})
